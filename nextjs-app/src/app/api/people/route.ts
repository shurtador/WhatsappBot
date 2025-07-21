import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  paginatedResponse, 
  validatePaginationParams,
  handleApiError,
  buildSearchQuery,
  buildFilterQuery,
  validateEmail
} from '@/lib/api-utils.ts';
import type { GetPeopleRequest, Person } from '@/types/api.ts';

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
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const company = searchParams.get('company') || undefined;
    const isDecisionMaker = searchParams.get('isDecisionMaker') === 'true' ? true : 
                           searchParams.get('isDecisionMaker') === 'false' ? false : undefined;
    const sortBy = searchParams.get('sortBy') as GetPeopleRequest['sortBy'] || 'last_seen';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    
    // Validate pagination parameters
    const { page: pageNum, limit: limitNum } = validatePaginationParams(page, limit);
    
    // Build query
    let query = supabase
      .from('people')
      .select('*', { count: 'exact' });
    
    // Apply search filter
    if (search) {
      const searchQuery = buildSearchQuery(search, ['first_name', 'last_name', 'display_name', 'company', 'email']);
      if (searchQuery) {
        query = query.or(searchQuery);
      }
    }
    
    // Apply filters
    const filters: Record<string, any> = {};
    if (tags && tags.length > 0) {
      filters.tags = tags;
    }
    if (company) {
      filters.company = company;
    }
    if (isDecisionMaker !== undefined) {
      filters.is_decision_maker = isDecisionMaker;
    }
    
    const filterQuery = buildFilterQuery(filters);
    if (filterQuery) {
      query = query.or(filterQuery);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: people, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch contacts', 500);
    }
    
    const total = count || 0;
    
    return paginatedResponse(people || [], pageNum, limitNum, total);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    
    // Parse request body
    const body = await request.json();
    const { 
      jid, 
      phone_number, 
      first_name, 
      last_name, 
      display_name, 
      company, 
      role, 
      is_decision_maker, 
      email, 
      notes, 
      tags 
    } = body;
    
    // Validate required fields
    if (!jid) {
      return errorResponse('JID is required', 400);
    }
    
    if (!phone_number) {
      return errorResponse('Phone number is required', 400);
    }
    
    // Validate email if provided
    if (email && !validateEmail(email)) {
      return errorResponse('Invalid email format', 400);
    }
    
    // Check if contact already exists
    const { data: existingContact } = await supabase
      .from('people')
      .select('jid')
      .eq('jid', jid)
      .single();
    
    if (existingContact) {
      return errorResponse('Contact already exists', 409);
    }
    
    // Create new contact
    const newContact = {
      jid,
      phone_number,
      first_name: first_name || null,
      last_name: last_name || null,
      display_name: display_name || null,
      company: company || null,
      role: role || null,
      is_decision_maker: is_decision_maker || false,
      email: email || null,
      notes: notes || null,
      tags: tags || [],
      last_seen: new Date().toISOString()
    };
    
    const { data: contact, error } = await supabase
      .from('people')
      .insert(newContact)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to create contact', 500);
    }
    
    return successResponse(contact, 'Contact created successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
} 