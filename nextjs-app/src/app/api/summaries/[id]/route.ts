import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  handleApiError
} from '@/lib/api-utils.ts';
import type { SummaryResponse } from '@/types/api.ts';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return errorResponse('Summary ID is required', 400);
    }
    
    // Fetch summary
    const { data: summary, error } = await supabase
      .from('message_summaries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Summary not found', 404);
      }
      console.error('Database error:', error);
      return errorResponse('Failed to fetch summary', 500);
    }
    
    // Transform to response format
    const response: SummaryResponse = {
      id: summary.id,
      chat_jid: summary.chat_jid!,
      summary_type: summary.summary_type as any,
      summary_period_start: summary.summary_period_start!,
      summary_period_end: summary.summary_period_end!,
      summary_content: summary.summary_content,
      message_count: summary.message_count,
      participants_involved: summary.participants_involved || [],
      created_at: summary.created_at!
    };
    
    return successResponse(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return errorResponse('Summary ID is required', 400);
    }
    
    // Check if summary exists
    const { data: existingSummary } = await supabase
      .from('message_summaries')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingSummary) {
      return errorResponse('Summary not found', 404);
    }
    
    // Delete summary
    const { error } = await supabase
      .from('message_summaries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to delete summary', 500);
    }
    
    return successResponse(null, 'Summary deleted successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
} 