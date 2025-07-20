# Supabase Database Setup Instructions

Based on the WhatsApp Bridge & Business Intelligence System PRD, here are the complete instructions for setting up the required tables in Supabase.

## Prerequisites

1. Have access to your Supabase project
2. Use the Supabase MCP to execute these SQL commands
3. Execute commands in the order specified due to foreign key dependencies

## Step 1: Enable Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Step 2: Create Tables

### 1. `people` (WhatsApp Contacts)
```sql
CREATE TABLE people (
    jid TEXT PRIMARY KEY,
    phone_number TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    company TEXT,
    role TEXT,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    email TEXT,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `chats` (WhatsApp Conversations)
```sql
CREATE TABLE chats (
    jid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    chat_type TEXT NOT NULL CHECK (chat_type IN ('individual', 'group')),
    group_info JSONB,
    last_message_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `messages` (Message History)
```sql
CREATE TABLE messages (
    id TEXT,
    chat_jid TEXT REFERENCES chats(jid),
    sender_jid TEXT REFERENCES people(jid),
    sender_name TEXT,
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    is_from_me BOOLEAN DEFAULT FALSE,
    message_type TEXT DEFAULT 'text',
    media_info JSONB,
    reply_to TEXT,
    forwarded_from TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, chat_jid)
);
```

### 4. `message_summaries` (AI-Generated Summaries)
```sql
CREATE TABLE message_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_jid TEXT REFERENCES chats(jid),
    summary_type TEXT NOT NULL,
    summary_period_start TIMESTAMP WITH TIME ZONE,
    summary_period_end TIMESTAMP WITH TIME ZONE,
    summary_content TEXT NOT NULL,
    message_count INTEGER NOT NULL,
    participants_involved TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. `scheduled_messages` (Message Queue)
```sql
CREATE TABLE scheduled_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_jid TEXT REFERENCES chats(jid),
    message_content TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE
);
```

### 6. `people_interactions` (Engagement Tracking)
```sql
CREATE TABLE people_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_jid TEXT REFERENCES people(jid),
    chat_jid TEXT REFERENCES chats(jid),
    interaction_date DATE NOT NULL,
    message_count INTEGER DEFAULT 0,
    first_message_time TIMESTAMP WITH TIME ZONE,
    last_message_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(person_jid, chat_jid, interaction_date)
);
```

## Step 3: Create Performance Indexes

```sql
-- Messages table indexes
CREATE INDEX idx_messages_chat_jid ON messages(chat_jid);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_sender_jid ON messages(sender_jid);

-- People table indexes
CREATE INDEX idx_people_phone_number ON people(phone_number);
CREATE INDEX idx_people_company ON people(company);

-- Chats table indexes
CREATE INDEX idx_chats_chat_type ON chats(chat_type);
CREATE INDEX idx_chats_last_message_time ON chats(last_message_time);

-- Scheduled messages indexes
CREATE INDEX idx_scheduled_messages_status ON scheduled_messages(status);
CREATE INDEX idx_scheduled_messages_scheduled_for ON scheduled_messages(scheduled_for);
```

## Step 4: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_interactions ENABLE ROW LEVEL SECURITY;
```

## Step 5: Create Basic RLS Policies

**Note**: These are basic policies. You may need to adjust them based on your specific authentication and authorization requirements.

```sql
-- People table policies
CREATE POLICY "Enable read access for authenticated users" ON people
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON people
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON people
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Chats table policies
CREATE POLICY "Enable read access for authenticated users" ON chats
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON chats
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON chats
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Messages table policies
CREATE POLICY "Enable read access for authenticated users" ON messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Message summaries table policies
CREATE POLICY "Enable read access for authenticated users" ON message_summaries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON message_summaries
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Scheduled messages table policies
CREATE POLICY "Enable read access for authenticated users" ON scheduled_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON scheduled_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON scheduled_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- People interactions table policies
CREATE POLICY "Enable read access for authenticated users" ON people_interactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON people_interactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON people_interactions
    FOR UPDATE USING (auth.role() = 'authenticated');
```

## Important Notes

1. **Order Matters**: Execute the commands in the exact order specified due to foreign key dependencies
2. **Users Table**: The `users` table is automatically created by Supabase Auth, so you don't need to create it manually
3. **Data Types**: The schema uses PostgreSQL-specific types like `JSONB` and `TEXT[]`
4. **Constraints**: Pay attention to the CHECK constraints and UNIQUE constraints
5. **RLS Policies**: The provided policies are basic. You may need to customize them based on your specific requirements
6. **Testing**: After setup, verify that all tables are created correctly and test the foreign key relationships

## Verification Commands

After completing the setup, you can verify the tables were created correctly:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
```

## Next Steps

After completing this database setup:

1. Generate TypeScript types using Supabase CLI or dashboard
2. Set up your environment variables for the Go bridge and Next.js application
3. Begin implementing the Go bridge migration from SQLite to Supabase
4. Create the Next.js application with Supabase client integration 