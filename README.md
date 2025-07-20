# WhatsApp Bridge & Business Intelligence System

A comprehensive WhatsApp integration system that bridges WhatsApp conversations with business intelligence capabilities. The system consists of a Go-based WhatsApp bridge and a Next.js application for business logic processing, both connected via Supabase.

## 🚀 Quick Start

### Prerequisites
- Go 1.24.1 or higher
- Supabase account and project
- WhatsApp account for QR authentication

### 1. Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```bash
# Go Service
OPENAI_API_KEY=your_openai_key_here
SUPABASE_POSTGRES_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
GO_BRIDGE_ENV=development
SUPABASE_STORAGE_BUCKET=main-bucket

# TypeScript App
SUPABASE_URL=https://project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_POOL_SIZE=10

# Service Ports
GO_BRIDGE_PORT=8080
NEXTJS_PORT=3000

# Service URLs (for local development)
GO_BRIDGE_URL=http://localhost:8080
NEXTJS_URL=http://localhost:3000
```

### 2. Database Setup

Run the Supabase setup SQL commands from `Planning/supabase-setup-instructions.md` to create the required tables.

### 3. Build and Run

```bash
# Navigate to the WhatsApp bridge directory
cd whatsapp-bridge

# Install dependencies
go mod tidy

# Build the application
go build -o whatsapp-client

# Run the bridge
./whatsapp-client
```

### 4. QR Code Authentication

On first run, the bridge will display a QR code. Scan it with your WhatsApp app:
1. Open WhatsApp on your phone
2. Go to Settings > Linked Devices > Link a Device
3. Scan the QR code displayed in the terminal
4. Wait for authentication confirmation

## 📡 API Endpoints

The WhatsApp bridge provides a REST API on port 8080.

### Send Message
```bash
curl -X POST http://localhost:8080/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "573188832047@s.whatsapp.net",
    "message": "Hello from the WhatsApp Bridge! 🚀"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Send Media Message
```bash
curl -X POST http://localhost:8080/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "573188832047@s.whatsapp.net",
    "message": "Check out this image!",
    "media_path": "/path/to/image.jpg"
  }'
```

### Download Media
```bash
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "message_id_here",
    "chat_jid": "chat_jid_here"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully downloaded image media",
  "filename": "image.jpg",
  "path": "/downloads/image.jpg"
}
```

## 🗄️ Database Schema

### Core Tables

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
- `tags` TEXT[] DEFAULT '{}' - Array of tags
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

## 🔧 Testing

### Run Supabase Integration Tests
```bash
./whatsapp-client -test
```

### Run Comprehensive Tests
```bash
./whatsapp-client -test-comprehensive
```

## 📊 Features

### ✅ Completed Features
- **WhatsApp Connection**: QR-based authentication
- **Message Storage**: Automatic storage of all messages
- **Contact Management**: Auto-creation of people records
- **Media Handling**: Download and store media files
- **Message Sending**: API-driven message sending
- **Database Integration**: Full Supabase PostgreSQL integration
- **Foreign Key Compliance**: Proper database relationships
- **Real-time Processing**: Live message processing and storage

### 🚧 Upcoming Features
- **Basic Summaries**: OpenAI-powered message summarization
- **Contact Enrichment UI**: Manual contact information management
- **Advanced Analytics**: Engagement metrics and insights
- **Message Queue**: Robust message scheduling system
- **Advanced Summaries**: Custom summary types and scheduling

## 🏗️ Architecture

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

## 🔒 Security

- **Row Level Security (RLS)**: Implement proper database access controls
- **Environment Variables**: Secure storage of API keys and credentials
- **Input Validation**: Validate all API inputs
- **Error Handling**: Secure error messages without exposing internals

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Failed to connect to database: failed to upgrade database
   ```
   - Check your `SUPABASE_POSTGRES_URL` in the `.env` file
   - Ensure your Supabase project is active
   - Verify network connectivity

2. **Foreign Key Constraint Error**
   ```
   insert or update on table "messages" violates foreign key constraint
   ```
   - This should be automatically resolved by the `EnsurePersonExists` function
   - Check that the `people` table exists and has proper structure

3. **QR Code Timeout**
   ```
   Timeout waiting for QR code scan
   ```
   - Make sure WhatsApp is open and ready to scan
   - Try again within 3 minutes
   - Check your phone's internet connection

4. **API 404 Error**
   ```
   404 page not found
   ```
   - Use the correct endpoint: `/api/send` not `/send`
   - Ensure the bridge is running on port 8080
   - Check that the REST server started successfully

### Logs and Debugging

The bridge provides detailed logging:
- `[Client INFO]` - WhatsApp client events
- `[Database INFO]` - Database operations
- `[Client WARN]` - Warning messages
- `[Client ERROR]` - Error messages

## 📝 Development

### Project Structure
```
WhatsappBot/
├── whatsapp-bridge/          # Go WhatsApp bridge
│   ├── main.go              # Main application
│   ├── go.mod               # Go dependencies
│   ├── test_supabase.go     # Supabase tests
│   └── store/               # Session storage
├── Planning/                # Project documentation
│   ├── prd.md              # Product requirements
│   └── supabase-setup-instructions.md
├── types/                   # TypeScript types
└── .env                     # Environment variables
```

### Adding New Features

1. **New API Endpoints**: Add handlers in `startRESTServer()`
2. **Database Operations**: Add methods to `MessageStore` struct
3. **Message Processing**: Modify `handleMessage()` function
4. **Media Handling**: Extend `extractMediaInfo()` function

## 📚 Documentation

- [Product Requirements Document](Planning/prd.md)
- [Supabase Setup Instructions](Planning/supabase-setup-instructions.md)
- [API Documentation](#api-endpoints)

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

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Version**: 1.1.0  
**Status**: Phase 2 Complete - Ready for Phase 3 (Next.js Application)  
**Last Updated**: 2025-07-19 