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

### Phase 2: Go Bridge Migration ✅
- [x] Remove SQLite dependencies
- [x] Add Supabase Go client
- [x] Update message storage with people management
- [x] Implement automatic contact creation
- [x] Update media handling for Supabase
- [x] Create HTTP API endpoints
- [ ] Create Dockerfile for Go service

### Phase 3: Next.js Application
- [x] **3.1 Next.js Project Setup and Configuration**
  - [x] Create Next.js project with TypeScript in `nextjs-app/` directory
  - [x] Configure TypeScript with strict mode and proper settings
  - [x] Set up ESLint and Prettier for code quality
  - [x] Configure Next.js for API routes and server-side rendering
  - [x] Set up project structure with proper folder organization
  - [x] Create base layout and global styles (Chakra UI)
  - [x] Configure environment variables and `.env.local`
  - [x] **(Extra)** Built a professional landing page with Chakra UI for developer experience and future use. **This will be moved to Phase 3.6/3.7 for further development.**

> **Note:** The landing page was built early to ensure Chakra UI integration and a smooth developer experience, but the main focus for the next phases will be backend workflows and CLI flows. UI/UX work (including the landing page and dashboards) will be continued in Phase 3.6 (Contact Management UI) and Phase 3.7 (Business Intelligence Features).

- [ ] **3.2 Supabase Client Integration and Authentication**
  - [ ] Install and configure Supabase client libraries
  - [ ] Set up Supabase client configuration with environment variables
  - [ ] Create authentication context and hooks
  - [ ] Implement login/logout functionality with Supabase Auth
  - [ ] Set up protected routes and authentication guards
  - [ ] Create user profile management
  - [ ] Test authentication flow end-to-end

- [ ] **3.3 OpenAI Integration for Message Summarization**
  - [ ] Install OpenAI SDK and configure API client
  - [ ] Create OpenAI service with proper error handling
  - [ ] Implement message summarization logic
  - [ ] Create prompt engineering for different summary types (daily, weekly, custom)
  - [ ] Add rate limiting and cost management
  - [ ] Implement retry logic for failed API calls
  - [ ] Create summary quality validation

- [ ] **3.4 API Route Implementation for Business Logic**
  - [ ] **3.4.1 Summary Generation API**
    - [ ] Create `/api/summaries/generate` endpoint
    - [ ] Implement message retrieval from Supabase
    - [ ] Add OpenAI integration for summary generation
    - [ ] Store generated summaries in database
    - [ ] Add validation and error handling
  - [ ] **3.4.2 Summary Scheduling API**
    - [ ] Create `/api/summaries/schedule` endpoint
    - [ ] Implement scheduling logic with cron-like functionality
    - [ ] Add schedule management (create, update, delete)
    - [ ] Integrate with message sending via Go bridge
  - [ ] **3.4.3 Contact Management API**
    - [ ] Create `/api/people` endpoint for listing contacts
    - [ ] Create `/api/people/[jid]` endpoint for updating contact info
    - [ ] Implement contact search and filtering
    - [ ] Add contact enrichment functionality
  - [ ] **3.4.4 Analytics API**
    - [ ] Create `/api/analytics/engagement` endpoint
    - [ ] Implement engagement metrics calculation
    - [ ] Add message volume analytics
    - [ ] Create decision maker tracking
  - [ ] **3.4.5 Go Bridge Integration API**
    - [ ] Create wrapper functions for Go bridge API calls
    - [ ] Implement message sending via Go bridge
    - [ ] Add media download functionality
    - [ ] Create error handling for bridge communication

- [ ] **3.5 Scheduled Task System for Summary Generation**
  - [ ] Set up cron job system (using node-cron or similar)
  - [ ] Implement daily summary generation at configurable times
  - [ ] Create weekly summary generation logic
  - [ ] Add custom summary scheduling functionality
  - [ ] Implement summary delivery via WhatsApp
  - [ ] Add summary generation status tracking
  - [ ] Create summary failure handling and retry logic

- [ ] **3.6 Contact Management UI (V2 Features)**
  - [ ] **3.6.1 Contact List Interface**
    - [ ] Create responsive contact list component
    - [ ] Implement contact search and filtering
    - [ ] Add contact sorting options
    - [ ] Create contact detail view
  - [ ] **3.6.2 Contact Edit Interface**
    - [ ] Create contact edit form with validation
    - [ ] Implement business information fields
    - [ ] Add tag management system
    - [ ] Create decision maker flagging
  - [ ] **3.6.3 Contact Analytics Dashboard**
    - [ ] Create engagement metrics visualization
    - [ ] Implement message volume charts
    - [ ] Add interaction timeline view
    - [ ] Create export functionality
  - [ ] **3.6.4 Landing Page & Hero UI**
    - [ ] Polish and finalize the landing page and hero UI (initial version built in 3.1 for DX)
    - [ ] Add navigation, branding, and onboarding flows
    - [ ] Integrate with authentication and dashboard

- [ ] **3.7 Business Intelligence Features**
  - [ ] **3.7.1 Summary Dashboard**
    - [ ] Create summary overview page
    - [ ] Implement summary history view
    - [ ] Add summary search and filtering
    - [ ] Create summary export functionality
  - [ ] **3.7.2 Analytics Dashboard**
    - [ ] Create engagement analytics page
    - [ ] Implement message volume trends
    - [ ] Add participant activity tracking
    - [ ] Create custom report generation
  - [ ] **3.7.3 Decision Maker Tracking**
    - [ ] Create decision maker identification
    - [ ] Implement influence scoring
    - [ ] Add relationship mapping
    - [ ] Create stakeholder analysis

- [ ] **3.8 Docker Configuration for Next.js Service**
  - [ ] Create Dockerfile for Next.js application
  - [ ] Configure multi-stage build for optimization
  - [ ] Set up environment variable handling
  - [ ] Add health check endpoints
  - [ ] Configure proper logging
  - [ ] Optimize image size and build time

- [ ] **3.9 Integration Testing with Existing Go Bridge**
  - [ ] **3.9.1 API Integration Tests**
    - [ ] Test message sending via Go bridge
    - [ ] Verify message retrieval from database
    - [ ] Test media download functionality
    - [ ] Validate error handling scenarios
  - [ ] **3.9.2 End-to-End Workflow Tests**
    - [ ] Test complete summary generation workflow
    - [ ] Verify scheduled summary delivery
    - [ ] Test contact management integration
    - [ ] Validate analytics data flow
  - [ ] **3.9.3 Performance Testing**
    - [ ] Test API response times
    - [ ] Verify database query performance
    - [ ] Test concurrent user scenarios
    - [ ] Validate memory usage

- [ ] **3.10 Security and Error Handling**
  - [ ] Implement proper input validation for all API endpoints
  - [ ] Add rate limiting for API routes
  - [ ] Set up proper error logging and monitoring
  - [ ] Implement secure error messages
  - [ ] Add API key rotation and management
  - [ ] Create audit logging for sensitive operations

- [ ] **3.11 Documentation and Testing**
  - [ ] Create API documentation with examples
  - [ ] Write unit tests for all business logic
  - [ ] Create integration test suite
  - [ ] Document deployment procedures
  - [ ] Create user guides for features
  - [ ] Add code documentation and comments

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
- **Database & Auth**
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Supabase anon key (for client)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server)
  - `SUPABASE_POSTGRES_URL` - Direct database connection
- **AI Services**
  - `OPENAI_API_KEY` - OpenAI API key for message summarization
  - `OPENAI_MODEL` - OpenAI model to use (default: gpt-4o-mini)
- **Service Configuration**
  - `GO_BRIDGE_PORT` - Go bridge HTTP server port (8080)
  - `NEXTJS_PORT` - Next.js app port (3000)
  - `GO_BRIDGE_URL` - URL for Next.js to call Go bridge (http://localhost:8080)
- **Application Settings**
  - `NEXTAUTH_SECRET` - NextAuth secret for session management
  - `NEXTAUTH_URL` - NextAuth URL (http://localhost:3000)
  - `NODE_ENV` - Environment (development, production)

## 🚀 Key Features

### MVP Features ✅
1. **WhatsApp Connection**: QR-based authentication ✅
2. **Message Storage**: Automatic storage of all messages ✅
3. **Contact Management**: Auto-creation of people records ✅
4. **Media Handling**: Download and store media files ✅
5. **Message Sending**: API-driven message sending ✅
6. **Basic Summaries**: OpenAI-powered message summarization (pending)

### V2 Features
1. **Contact Enrichment UI**: Manual contact information management
2. **Advanced Analytics**: Engagement metrics and insights
3. **Message Queue**: Robust message scheduling system
4. **Advanced Summaries**: Custom summary types and scheduling
5. **Business Intelligence**: Decision maker tracking and insights

## 📝 API Endpoints

### Go Bridge API ✅
- `POST /send` - Send WhatsApp message ✅
- `GET /chats` - List all chats ✅
- `GET /messages/{chatJID}` - Get chat messages ✅
- `POST /download-media` - Download media files ✅

### Next.js API
- **Summary Management**
  - `POST /api/summaries/generate` - Generate message summary
  - `POST /api/summaries/schedule` - Schedule summary delivery
  - `GET /api/summaries` - List all summaries
  - `GET /api/summaries/{id}` - Get specific summary
  - `DELETE /api/summaries/{id}` - Delete summary
- **Contact Management**
  - `GET /api/people` - List all contacts with filtering
  - `GET /api/people/{jid}` - Get specific contact
  - `PUT /api/people/{jid}` - Update contact information
  - `POST /api/people/{jid}/tags` - Add tags to contact
  - `DELETE /api/people/{jid}/tags` - Remove tags from contact
- **Analytics**
  - `GET /api/analytics/engagement` - Get engagement metrics
  - `GET /api/analytics/message-volume` - Get message volume trends
  - `GET /api/analytics/decision-makers` - Get decision maker insights
  - `GET /api/analytics/contacts/{jid}` - Get contact-specific analytics
- **Go Bridge Integration**
  - `POST /api/bridge/send` - Send message via Go bridge
  - `GET /api/bridge/chats` - Get chats from Go bridge
  - `GET /api/bridge/messages/{chatJID}` - Get messages from Go bridge
  - `POST /api/bridge/download-media` - Download media via Go bridge

## 🔒 Security Considerations

- **Row Level Security (RLS)**: Implement proper database access controls
- **Environment Variables**: Secure storage of API keys and credentials
- **Input Validation**: Validate all API inputs
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Error Handling**: Secure error messages without exposing internals

## 📊 Success Metrics

- **Message Processing**: 99%+ message storage success rate ✅
- **API Response Time**: <500ms for message sending ✅
- **Summary Generation**: Successful daily/weekly summaries (pending)
- **Contact Management**: Accurate auto-creation of contact records ✅
- **System Uptime**: 99%+ availability ✅

## 🎉 Latest Achievements (v1.1.0)

### ✅ Completed Features
- **WhatsApp Bridge**: Fully functional Go bridge with Supabase integration
- **QR Authentication**: Working QR code authentication system
- **Message Processing**: Real-time message storage with proper database relationships
- **Contact Auto-Creation**: Automatic people record creation in database
- **Media Support**: Audio, images, and document message handling
- **REST API**: Complete HTTP API endpoints for message operations
- **Database Integration**: Full Supabase PostgreSQL integration with foreign keys
- **Error Resolution**: Fixed foreign key constraint violations
- **Live Testing**: Successfully tested with real WhatsApp messages

### 🔧 Technical Improvements
- **Database Schema**: Proper foreign key relationships between messages and people
- **JID Handling**: Full JID usage instead of partial user IDs
- **Person Management**: Automatic creation of people records before message storage
- **Media Download**: Support for downloading and storing media files
- **Session Management**: Persistent WhatsApp session storage

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

### [v1.1.0] - 2025-07-19
- ✅ **WhatsApp Bridge Complete**: Full Go bridge implementation with Supabase integration
- ✅ **QR Code Authentication**: Working QR code authentication system
- ✅ **Message Storage**: Automatic message storage with foreign key compliance
- ✅ **Contact Management**: Auto-creation of people records in database
- ✅ **Media Handling**: Support for audio, images, and document messages
- ✅ **REST API**: Complete HTTP API for message sending and retrieval
- ✅ **Database Integration**: Full Supabase PostgreSQL integration
- ✅ **Foreign Key Fixes**: Resolved database constraint violations
- ✅ **Real-time Processing**: Live message processing and storage

### [v1.0.0] - Initial Release
- Initial project setup
- Database schema design
- Architecture planning

---

**Last Updated**: 2025-07-19
**Version**: 1.2.0
**Status**: Phase 2 Complete - Phase 3 Detailed Planning Complete - Ready for Next.js Development 