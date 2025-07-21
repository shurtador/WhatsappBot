import type { Tables, TablesInsert, TablesUpdate } from './supabase.ts';

// Contact Management Types
export type Person = Tables<'people'>;
export type PersonInsert = TablesInsert<'people'>;
export type PersonUpdate = TablesUpdate<'people'>;

// API Request Types
export interface GetPeopleRequest {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  company?: string;
  isDecisionMaker?: boolean;
  sortBy?: 'first_name' | 'last_name' | 'company' | 'last_seen' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdatePersonRequest {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  company?: string;
  role?: string;
  is_decision_maker?: boolean;
  email?: string;
  notes?: string;
  tags?: string[];
}

export interface AddTagsRequest {
  tags: string[];
}

export interface RemoveTagsRequest {
  tags: string[];
}

// API Response Types
export interface GetPeopleResponse {
  people: Person[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PersonResponse {
  person: Person;
}

export interface TagsResponse {
  tags: string[];
}

// Contact Statistics
export interface ContactStats {
  total: number;
  withCompany: number;
  decisionMakers: number;
  withEmail: number;
  recentlyActive: number; // Active in last 30 days
  byTag: Record<string, number>;
}

// Contact Enrichment
export interface ContactEnrichmentRequest {
  jid: string;
  enrichmentData: {
    company?: string;
    role?: string;
    email?: string;
    isDecisionMaker?: boolean;
    notes?: string;
    tags?: string[];
  };
}

// Search and Filter Types
export interface ContactFilters {
  search?: string;
  tags?: string[];
  company?: string;
  isDecisionMaker?: boolean;
  hasEmail?: boolean;
  lastSeenAfter?: string; // ISO date string
  lastSeenBefore?: string; // ISO date string
}

export interface ContactSort {
  field: 'first_name' | 'last_name' | 'company' | 'last_seen' | 'created_at' | 'message_count';
  order: 'asc' | 'desc';
} 