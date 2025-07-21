import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  handleApiError,
  validateEmail
} from '@/lib/api-utils.ts';
import type { UpdatePersonRequest, Person } from '@/types/api.ts';

export async function GET(
  request: NextRequest,
  { params }: { params: { jid: string } }
) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    const { jid } = params;
    
    // Validate JID
    if (!jid) {
      return errorResponse('JID is required', 400);
    }
    
    // Fetch contact
    const { data: person, error } = await supabase
      .from('people')
      .select('*')
      .eq('jid', jid)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Contact not found', 404);
      }
      console.error('Database error:', error);
      return errorResponse('Failed to fetch contact', 500);
    }
    
    return successResponse(person);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { jid: string } }
) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    const { jid } = params;
    
    // Validate JID
    if (!jid) {
      return errorResponse('JID is required', 400);
    }
    
    // Parse request body
    const body: UpdatePersonRequest = await request.json();
    const {
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
    
    // Validate email if provided
    if (email && !validateEmail(email)) {
      return errorResponse('Invalid email format', 400);
    }
    
    // Check if contact exists
    const { data: existingContact } = await supabase
      .from('people')
      .select('jid')
      .eq('jid', jid)
      .single();
    
    if (!existingContact) {
      return errorResponse('Contact not found', 404);
    }
    
    // Prepare update data
    const updateData: Partial<Person> = {};
    
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (display_name !== undefined) updateData.display_name = display_name;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;
    if (is_decision_maker !== undefined) updateData.is_decision_maker = is_decision_maker;
    if (email !== undefined) updateData.email = email;
    if (notes !== undefined) updateData.notes = notes;
    if (tags !== undefined) updateData.tags = tags;
    
    // Add updated timestamp
    updateData.updated_at = new Date().toISOString();
    
    // Update contact
    const { data: updatedPerson, error } = await supabase
      .from('people')
      .update(updateData)
      .eq('jid', jid)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to update contact', 500);
    }
    
    return successResponse(updatedPerson, 'Contact updated successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jid: string } }
) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request);
    if ('error' in authResult) {
      return errorResponse(authResult.error, authResult.status);
    }
    
    const { supabase } = authResult;
    const { jid } = params;
    
    // Validate JID
    if (!jid) {
      return errorResponse('JID is required', 400);
    }
    
    // Check if contact exists
    const { data: existingContact } = await supabase
      .from('people')
      .select('jid')
      .eq('jid', jid)
      .single();
    
    if (!existingContact) {
      return errorResponse('Contact not found', 404);
    }
    
    // Check for related messages (optional - you might want to keep the contact for message history)
    const { data: relatedMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('sender_jid', jid)
      .limit(1);
    
    if (relatedMessages && relatedMessages.length > 0) {
      return errorResponse('Cannot delete contact with message history. Consider archiving instead.', 400);
    }
    
    // Delete contact
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('jid', jid);
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to delete contact', 500);
    }
    
    return successResponse(null, 'Contact deleted successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
} 