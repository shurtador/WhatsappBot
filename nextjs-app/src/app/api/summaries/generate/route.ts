import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  handleApiError,
  validatePaginationParams
} from '@/lib/api-utils.ts';
import { generateSummary, validateSummary, type SummaryType } from '@/lib/openai.ts';
import type { GenerateSummaryRequest, SummaryResponse } from '@/types/api.ts';

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    
    // Parse request body
    const body: GenerateSummaryRequest = await request.json();
    const { 
      chatJid, 
      summaryType, 
      startDate, 
      endDate, 
      customPrompt, 
      includeParticipants = true 
    } = body;
    
    // Validate required fields
    if (!chatJid) {
      return errorResponse('Chat JID is required', 400);
    }
    
    if (!summaryType || !['daily', 'weekly', 'custom'].includes(summaryType)) {
      return errorResponse('Valid summary type is required (daily, weekly, or custom)', 400);
    }
    
    if (summaryType === 'custom' && !customPrompt) {
      return errorResponse('Custom prompt is required for custom summary type', 400);
    }
    
    // Validate date range
    let startDateTime: Date;
    let endDateTime: Date;
    
    if (startDate && endDate) {
      startDateTime = new Date(startDate);
      endDateTime = new Date(endDate);
      
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return errorResponse('Invalid date format. Use ISO date strings', 400);
      }
      
      if (startDateTime >= endDateTime) {
        return errorResponse('Start date must be before end date', 400);
      }
    } else {
      // Default to last 24 hours for daily, last 7 days for weekly
      endDateTime = new Date();
      if (summaryType === 'daily') {
        startDateTime = new Date(endDateTime.getTime() - 24 * 60 * 60 * 1000);
      } else {
        startDateTime = new Date(endDateTime.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }
    
    // Check if chat exists
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('name, chat_type')
      .eq('jid', chatJid)
      .single();
    
    if (chatError || !chat) {
      return errorResponse('Chat not found', 404);
    }
    
    // Retrieve messages for the specified time period
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_name,
        timestamp,
        is_from_me,
        sender_jid
      `)
      .eq('chat_jid', chatJid)
      .gte('timestamp', startDateTime.toISOString())
      .lte('timestamp', endDateTime.toISOString())
      .order('timestamp', { ascending: true });
    
    if (messagesError) {
      console.error('Database error fetching messages:', messagesError);
      return errorResponse('Failed to retrieve messages', 500);
    }
    
    if (!messages || messages.length === 0) {
      return errorResponse('No messages found for the specified time period', 404);
    }
    
    // Transform messages for OpenAI service
    const messagesForSummary = messages.map((msg: any) => ({
      content: msg.content || '',
      sender_name: msg.sender_name || 'Unknown',
      timestamp: msg.timestamp,
      is_from_me: msg.is_from_me || false
    }));
    
    // Generate summary using OpenAI
    const summaryResult = await generateSummary({
      messages: messagesForSummary,
      summaryType,
      chatName: chat.name,
      customPrompt
    });
    
    // Validate summary quality
    const validation = validateSummary(summaryResult.summary);
    if (!validation.isValid) {
      console.warn('Summary quality issues:', validation.issues);
      // Continue anyway, but log the issues
    }
    
    // Get participant information if requested
    let participants: string[] = [];
    if (includeParticipants) {
      // Get unique participant JIDs
      const participantJids = [...new Set(messages
        .filter((msg: any) => msg.sender_jid && !msg.is_from_me)
        .map((msg: any) => msg.sender_jid)
      )];
      
      // Get participant names from people table
      if (participantJids.length > 0) {
        const { data: people } = await supabase
          .from('people')
          .select('jid, first_name, last_name, display_name')
          .in('jid', participantJids);
        
        participants = people?.map((person: any) => 
          person.display_name || 
          `${person.first_name || ''} ${person.last_name || ''}`.trim() || 
          person.jid
        ) || [];
      }
    }
    
    // Store summary in database
    const summaryData = {
      chat_jid: chatJid,
      summary_type: summaryType,
      summary_period_start: startDateTime.toISOString(),
      summary_period_end: endDateTime.toISOString(),
      summary_content: summaryResult.summary,
      message_count: summaryResult.messageCount,
      participants_involved: participants
    };
    
    const { data: storedSummary, error: storeError } = await supabase
      .from('message_summaries')
      .insert(summaryData)
      .select()
      .single();
    
    if (storeError) {
      console.error('Database error storing summary:', storeError);
      return errorResponse('Failed to store summary', 500);
    }
    
    // Return the generated summary
    const response: SummaryResponse = {
      id: storedSummary.id,
      chat_jid: storedSummary.chat_jid!,
      summary_type: storedSummary.summary_type as SummaryType,
      summary_period_start: storedSummary.summary_period_start!,
      summary_period_end: storedSummary.summary_period_end!,
      summary_content: storedSummary.summary_content,
      message_count: storedSummary.message_count,
      participants_involved: storedSummary.participants_involved || [],
      created_at: storedSummary.created_at!
    };
    
    return successResponse(response, 'Summary generated successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const chatJid = searchParams.get('chatJid');
    const summaryType = searchParams.get('summaryType') as SummaryType | null;
    
    // Validate pagination parameters
    const { page: pageNum, limit: limitNum } = validatePaginationParams(page, limit);
    
    // Build query
    let query = supabase
      .from('message_summaries')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (chatJid) {
      query = query.eq('chat_jid', chatJid);
    }
    
    if (summaryType && ['daily', 'weekly', 'custom'].includes(summaryType)) {
      query = query.eq('summary_type', summaryType);
    }
    
    // Apply sorting (newest first)
    query = query.order('created_at', { ascending: false });
    
    // Apply pagination
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: summaries, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch summaries', 500);
    }
    
    const total = count || 0;
    
    return successResponse({
      summaries: summaries || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
} 