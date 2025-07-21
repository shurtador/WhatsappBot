import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  handleApiError
} from '@/lib/api-utils.ts';
import type { ContactStats } from '@/types/api.ts';

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    
    // Get total contacts
    const { count: total, error: totalError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error('Database error:', totalError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Get contacts with company
    const { count: withCompany, error: companyError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true })
      .not('company', 'is', null);
    
    if (companyError) {
      console.error('Database error:', companyError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Get decision makers
    const { count: decisionMakers, error: dmError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true })
      .eq('is_decision_maker', true);
    
    if (dmError) {
      console.error('Database error:', dmError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Get contacts with email
    const { count: withEmail, error: emailError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true })
      .not('email', 'is', null);
    
    if (emailError) {
      console.error('Database error:', emailError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Get recently active contacts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentlyActive, error: activeError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', thirtyDaysAgo.toISOString());
    
    if (activeError) {
      console.error('Database error:', activeError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Get tag distribution
    const { data: allContacts, error: tagsError } = await supabase
      .from('people')
      .select('tags');
    
    if (tagsError) {
      console.error('Database error:', tagsError);
      return errorResponse('Failed to fetch contact statistics', 500);
    }
    
    // Calculate tag distribution
    const tagCounts: Record<string, number> = {};
    allContacts?.forEach((contact: { tags: string[] | null }) => {
      if (contact.tags && Array.isArray(contact.tags)) {
        contact.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    const stats: ContactStats = {
      total: total || 0,
      withCompany: withCompany || 0,
      decisionMakers: decisionMakers || 0,
      withEmail: withEmail || 0,
      recentlyActive: recentlyActive || 0,
      byTag: tagCounts
    };
    
    return successResponse(stats);
    
  } catch (error) {
    return handleApiError(error);
  }
} 