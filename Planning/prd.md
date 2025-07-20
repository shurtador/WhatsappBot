# WhatsApp Bridge & Business Intelligence System - PRD

## 📋 Project Overview

A comprehensive WhatsApp integration system that bridges WhatsApp conversations with business intelligence capabilities. The system consists of a Go-based WhatsApp bridge and a Next.js application for business logic processing, both connected via Supabase.

## 🎯 Core Objectives

1. **WhatsApp Integration**: Seamlessly connect to WhatsApp Web and handle message processing
2. **Contact Management**: Automatically track and manage WhatsApp contacts with business information
3. **Message Intelligence**: Process messages through OpenAI for summarization and insights
4. **Automated Recaps**: Generate and send periodic summaries to relevant chats
5. **Scalable Architecture**: Docker-ready setup for easy deployment and scaling

## 🏗️ System Architecture

```
WhatsApp ←→ Go Bridge ←→ Supabase DB ←→ Next.js App
                ↓              ↓              ↓
           Direct DB writes  Data Storage  Business Logic
           HTTP API calls    Message History OpenAI Processing
           Media Handling    Contact Mgmt   Scheduled Recaps
                ↑              ↑              ↑
           Message Sending  Auth & Users   Summary Generation
           Media Upload     RLS Policies   Business Intelligence
```

### Communication Flow
- **Message Storage**: Go Bridge → Supabase (direct database writes)
- **Message Sending**: Next.js → Go Bridge (HTTP API calls)
- **Data Processing**: Next.js → Supabase (direct database reads/writes)

## 🗄️ Database Schema

### Core Tables

#### `users` (Supabase Auth)
- `id` UUID (Primary Key, references auth.users)
- `email` TEXT UNIQUE
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

#### `people` (WhatsApp Contacts)
- `jid` TEXT (Primary Key) - WhatsApp JID
- `phone_number` TEXT UNIQUE - International format
- `first_name` TEXT
- `last_name` TEXT
- `display_name` TEXT - WhatsApp display name
- `company` TEXT
- `role` TEXT
- `is_decision_maker` BOOLEAN DEFAULT FALSE
- `email` TEXT
- `notes` TEXT - Additional notes
- `tags` TEXT[] DEFAULT '{}' - Array of tags (client, prospect, vendor, etc.)
- `last_seen` TIMESTAMP WITH TIME ZONE
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

#### `chats` (WhatsApp Conversations)
- `jid` TEXT (Primary Key) - WhatsApp JID
- `name` TEXT NOT NULL
- `chat_type` TEXT NOT NULL CHECK (individual, group)
- `group_info` JSONB - Group metadata
- `last_message_time` TIMESTAMP WITH TIME ZONE
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

#### `messages` (Message History)
- `id` TEXT
- `chat_jid` TEXT (Foreign Key to chats)
- `sender_jid` TEXT (Foreign Key to people)
- `sender_name` TEXT - Display name at time of message
- `content` TEXT
- `timestamp` TIMESTAMP WITH TIME ZONE NOT NULL
- `is_from_me` BOOLEAN DEFAULT FALSE
- `message_type` TEXT DEFAULT 'text'
- `media_info` JSONB - Media metadata
- `reply_to` TEXT - ID of replied message
- `forwarded_from` TEXT - Original sender if forwarded
- `created_at` TIMESTAMP WITH TIME ZONE
- PRIMARY KEY (id, chat_jid)

#### `message_summaries` (AI-Generated Summaries)
- `id` UUID (Primary Key)
- `chat_jid` TEXT (Foreign Key to chats)
- `summary_type` TEXT NOT NULL - daily, weekly, custom
- `summary_period_start` TIMESTAMP WITH TIME ZONE
- `summary_period_end` TIMESTAMP WITH TIME ZONE
- `summary_content` TEXT NOT NULL
- `message_count` INTEGER NOT NULL
- `participants_involved` TEXT[] - Array of people JIDs
- `created_at` TIMESTAMP WITH TIME ZONE

#### `scheduled_messages` (Message Queue)
- `id` UUID (Primary Key)
- `chat_jid` TEXT (Foreign Key to chats)
- `message_content` TEXT NOT NULL
- `scheduled_for` TIMESTAMP WITH TIME ZONE NOT NULL
- `status` TEXT DEFAULT 'pending' CHECK (pending, sent, failed)
- `retry_count` INTEGER DEFAULT 0
- `created_at` TIMESTAMP WITH TIME ZONE
- `sent_at` TIMESTAMP WITH TIME ZONE

#### `people_interactions` (Engagement Tracking)
- `id` UUID (Primary Key)
- `person_jid` TEXT (Foreign Key to people)
- `chat_jid` TEXT (Foreign Key to chats)
- `interaction_date` DATE NOT NULL
- `message_count` INTEGER DEFAULT 0
- `first_message_time` TIMESTAMP WITH TIME ZONE
- `last_message_time` TIMESTAMP WITH TIME ZONE
- `created_at` TIMESTAMP WITH TIME ZONE
- UNIQUE(person_jid, chat_jid, interaction_date)

## 🔧 Technical Specifications

### Go WhatsApp Bridge
- **Framework**: Go with whatsmeow library
- **Database**: Supabase (PostgreSQL)
- **Port**: 8080
- **Key Features**:
  - WhatsApp Web connection with QR authentication
  - Message storage and retrieval
  - Media download and management
  - HTTP API for message sending
  - Automatic contact creation and management

### Next.js Application
- **Framework**: Next.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Port**: 3000
- **Key Features**:
  - OpenAI integration for message processing
  - Scheduled summary generation
  - Business logic and analytics
  - Contact management UI (V2)
  - REST API endpoints

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Containerization**: Docker with docker-compose
- **Environment**: Local development with Docker
- **Future**: Server deployment ready

## 📋 Implementation Phases

### Phase 1: Database Setup ✅
- [x] Design database schema
- [x] Create Supabase tables
- [x] Set up Row Level Security (RLS) policies
- [x] Generate TypeScript types

### Phase 2: Go Bridge Migration
- [ ] Remove SQLite dependencies
- [ ] Add Supabase Go client
- [ ] Update message storage with people management
- [ ] Implement automatic contact creation
- [ ] Update media handling for Supabase
- [ ] Create HTTP API endpoints
- [ ] Create Dockerfile for Go service

### Phase 3: Next.js Application
- [ ] Create Next.js project with TypeScript
- [ ] Set up Supabase client and auth
- [ ] Create API routes for business logic
- [ ] Implement OpenAI integration
- [ ] Create scheduled summary generation
- [ ] Create Dockerfile for Next.js service

### Phase 4: Docker Integration
- [ ] Create docker-compose.yml
- [ ] Set up environment variables
- [ ] Test local Docker deployment
- [ ] Document deployment process

### Phase 5: Testing & Optimization
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Logging and monitoring

## 🔑 Environment Variables

### Required Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `SUPABASE_POSTGRES_URL` - Direct database connection
- `OPENAI_API_KEY` - OpenAI API key
- `GO_BRIDGE_PORT` - Go bridge HTTP server port (8080)
- `NEXTJS_PORT` - Next.js app port (3000)
- `GO_BRIDGE_URL` - URL for Next.js to call Go bridge

## 🚀 Key Features

### MVP Features
1. **WhatsApp Connection**: QR-based authentication
2. **Message Storage**: Automatic storage of all messages
3. **Contact Management**: Auto-creation of people records
4. **Media Handling**: Download and store media files
5. **Message Sending**: API-driven message sending
6. **Basic Summaries**: OpenAI-powered message summarization

### V2 Features
1. **Contact Enrichment UI**: Manual contact information management
2. **Advanced Analytics**: Engagement metrics and insights
3. **Message Queue**: Robust message scheduling system
4. **Advanced Summaries**: Custom summary types and scheduling
5. **Business Intelligence**: Decision maker tracking and insights

## 📝 API Endpoints

### Go Bridge API
- `POST /send` - Send WhatsApp message
- `GET /chats` - List all chats
- `GET /messages/{chatJID}` - Get chat messages
- `POST /download-media` - Download media files

### Next.js API
- `POST /api/summaries/generate` - Generate message summary
- `POST /api/summaries/schedule` - Schedule summary delivery
- `GET /api/people` - List all contacts
- `PUT /api/people/{jid}` - Update contact information
- `GET /api/analytics/engagement` - Get engagement metrics

## 🔒 Security Considerations

- **Row Level Security (RLS)**: Implement proper database access controls
- **Environment Variables**: Secure storage of API keys and credentials
- **Input Validation**: Validate all API inputs
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Error Handling**: Secure error messages without exposing internals

## 📊 Success Metrics

- **Message Processing**: 99%+ message storage success rate
- **API Response Time**: <500ms for message sending
- **Summary Generation**: Successful daily/weekly summaries
- **Contact Management**: Accurate auto-creation of contact records
- **System Uptime**: 99%+ availability

## 🐛 Known Issues & Limitations

- **WhatsApp Web**: Requires phone to stay connected
- **Media Storage**: Large media files may impact performance
- **Rate Limits**: WhatsApp and OpenAI API rate limits
- **Group Chats**: Complex participant management in large groups

## 📚 Documentation

- [ ] API Documentation
- [ ] Deployment Guide
- [ ] Troubleshooting Guide
- [ ] Development Setup Guide

## 🔄 Changelog

### [Unreleased]
- Initial project setup
- Database schema design
- Architecture planning

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Status**: Phase 1 Complete - Ready for Phase 2 