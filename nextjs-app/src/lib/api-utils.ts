import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from './supabase.ts';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Middleware
export async function authenticateRequest(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 };
    }
    
    const token = authHeader.substring(7);
    
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { error: 'Invalid or expired token', status: 401 };
    }
    
    return { user, supabase };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

// Response Helpers
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  });
}

export function errorResponse(error: string, status: number = 500): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error,
    timestamp: new Date().toISOString()
  }, { status });
}

export function paginatedResponse<T>(
  data: T[], 
  page: number, 
  limit: number, 
  total: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
}

// Validation Helpers
export function validatePaginationParams(page?: string, limit?: string) {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 20;
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Invalid page parameter');
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new Error('Invalid limit parameter (must be between 1 and 100)');
  }
  
  return { page: pageNum, limit: limitNum };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Error Handling
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Handle validation errors
    if (error.message.includes('Invalid')) {
      return errorResponse(error.message, 400);
    }
    
    // Handle database errors
    if (error.message.includes('duplicate key')) {
      return errorResponse('Resource already exists', 409);
    }
    
    if (error.message.includes('foreign key')) {
      return errorResponse('Referenced resource not found', 404);
    }
    
    return errorResponse(error.message, 500);
  }
  
  return errorResponse('An unexpected error occurred', 500);
}

// Query Helpers
export function buildSearchQuery(query: string, searchFields: string[]) {
  const searchTerms = query.split(' ').filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return '';
  
  const conditions = searchFields.map(field => 
    searchTerms.map(term => `${field}.ilike.%${term}%`).join(',')
  );
  
  return `or(${conditions.join(',')})`;
}

export function buildFilterQuery(filters: Record<string, any>) {
  const conditions: string[] = [];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        conditions.push(`${key}.in.(${value.join(',')})`);
      } else {
        conditions.push(`${key}.eq.${value}`);
      }
    }
  });
  
  return conditions.join(',');
} 