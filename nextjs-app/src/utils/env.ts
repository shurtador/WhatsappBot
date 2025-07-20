export const env = {
  // Database & Auth
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  SUPABASE_POSTGRES_URL: process.env.SUPABASE_POSTGRES_URL!,
  
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  
  // Service Configuration
  GO_BRIDGE_PORT: process.env.GO_BRIDGE_PORT || '8080',
  NEXTJS_PORT: process.env.NEXTJS_PORT || '3000',
  GO_BRIDGE_URL: process.env.GO_BRIDGE_URL || 'http://localhost:8080',
  
  // Application Settings
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'NEXTAUTH_SECRET',
  ] as const;
  
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}; 