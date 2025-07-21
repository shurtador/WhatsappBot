import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from './supabase.ts';

// Test utilities for API testing
export interface MockAuthResult {
  user: {
    id: string;
    email: string;
  };
  supabase: ReturnType<typeof createServerSupabaseClient>;
}

// Mock authentication for testing
export function createMockAuthRequest(token?: string): NextRequest {
  const headers = new Headers();
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  
  return new NextRequest('http://localhost:3000/api/test', {
    headers
  });
}

// Test data helpers
export const mockPerson = {
  jid: '1234567890@s.whatsapp.net',
  phone_number: '+1234567890',
  first_name: 'John',
  last_name: 'Doe',
  display_name: 'John Doe',
  company: 'Test Company',
  role: 'Developer',
  is_decision_maker: false,
  email: 'john.doe@test.com',
  notes: 'Test contact',
  tags: ['test', 'developer'],
  last_seen: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const mockPersonUpdate = {
  first_name: 'Jane',
  last_name: 'Smith',
  company: 'Updated Company',
  is_decision_maker: true,
  email: 'jane.smith@updated.com',
  notes: 'Updated notes',
  tags: ['updated', 'manager']
};

export const mockTags = ['client', 'prospect', 'vendor'];

// Validation test helpers
export function expectSuccessResponse(response: Response, expectedData?: any) {
  expect(response.status).toBe(200);
  const data = response.json();
  expect(data.success).toBe(true);
  if (expectedData) {
    expect(data.data).toEqual(expectedData);
  }
}

export function expectErrorResponse(response: Response, status: number, errorMessage?: string) {
  expect(response.status).toBe(status);
  const data = response.json();
  expect(data.success).toBe(false);
  if (errorMessage) {
    expect(data.error).toContain(errorMessage);
  }
}

// Database cleanup helper
export async function cleanupTestData(supabase: ReturnType<typeof createServerSupabaseClient>) {
  // Clean up test contacts
  await supabase
    .from('people')
    .delete()
    .like('jid', '%test%');
}

// Test environment setup
export function setupTestEnvironment() {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.SUPABASE_URL = 'http://localhost:54321';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
} 