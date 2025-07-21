import { NextRequest } from 'next/server';
import { 
  authenticateRequest, 
  successResponse, 
  errorResponse, 
  handleApiError
} from '@/lib/api-utils.ts';
import type { AddTagsRequest, RemoveTagsRequest } from '@/types/api.ts';

export async function POST(
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
    const body: AddTagsRequest = await request.json();
    const { tags } = body;
    
    // Validate tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return errorResponse('Tags array is required and must not be empty', 400);
    }
    
    // Validate tag format
    for (const tag of tags as string[]) {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        return errorResponse('All tags must be non-empty strings', 400);
      }
    }
    
    // Check if contact exists
    const { data: existingContact } = await supabase
      .from('people')
      .select('tags')
      .eq('jid', jid)
      .single();
    
    if (!existingContact) {
      return errorResponse('Contact not found', 404);
    }
    
    // Get current tags
    const currentTags = existingContact.tags || [];
    
    // Add new tags (avoid duplicates)
    const newTags = [...new Set([...currentTags, ...tags])];
    
    // Update contact with new tags
    const { data: updatedContact, error } = await supabase
      .from('people')
      .update({ 
        tags: newTags,
        updated_at: new Date().toISOString()
      })
      .eq('jid', jid)
      .select('tags')
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to add tags', 500);
    }
    
    return successResponse(updatedContact.tags, 'Tags added successfully');
    
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
    
    // Parse request body
    const body: RemoveTagsRequest = await request.json();
    const { tags } = body;
    
    // Validate tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return errorResponse('Tags array is required and must not be empty', 400);
    }
    
    // Check if contact exists
    const { data: existingContact } = await supabase
      .from('people')
      .select('tags')
      .eq('jid', jid)
      .single();
    
    if (!existingContact) {
      return errorResponse('Contact not found', 404);
    }
    
    // Get current tags
    const currentTags = existingContact.tags || [];
    
    // Remove specified tags
    const updatedTags = currentTags.filter(tag => !tags.includes(tag));
    
    // Update contact with remaining tags
    const { data: updatedContact, error } = await supabase
      .from('people')
      .update({ 
        tags: updatedTags,
        updated_at: new Date().toISOString()
      })
      .eq('jid', jid)
      .select('tags')
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to remove tags', 500);
    }
    
    return successResponse(updatedContact.tags, 'Tags removed successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
} 