# Summary Generation API Documentation

## Overview

The Summary Generation API provides AI-powered summarization of WhatsApp conversations using OpenAI. It can generate daily, weekly, or custom summaries from message history stored in Supabase.

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
http://localhost:3000/api/summaries
```

## Endpoints

### 1. Generate Summary

**POST** `/api/summaries/generate`

Generate a new summary from messages in a specific chat for a given time period.

#### Request Body

```json
{
  "chatJid": "1234567890@s.whatsapp.net",
  "summaryType": "daily",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-15T23:59:59Z",
  "customPrompt": "Focus on business decisions and action items",
  "includeParticipants": true
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatJid` | string | Yes | WhatsApp JID of the chat |
| `summaryType` | string | Yes | Type of summary (daily, weekly, custom) |
| `startDate` | string | No | Start date in ISO format (auto-calculated if not provided) |
| `endDate` | string | No | End date in ISO format (auto-calculated if not provided) |
| `customPrompt` | string | No | Custom prompt for custom summary type |
| `includeParticipants` | boolean | No | Include participant names (default: true) |

#### Summary Types

- **daily**: Last 24 hours of messages
- **weekly**: Last 7 days of messages  
- **custom**: Custom date range with optional custom prompt

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/summaries/generate" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatJid": "1234567890@s.whatsapp.net",
    "summaryType": "daily",
    "includeParticipants": true
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "chat_jid": "1234567890@s.whatsapp.net",
    "summary_type": "daily",
    "summary_period_start": "2024-01-15T00:00:00Z",
    "summary_period_end": "2024-01-15T23:59:59Z",
    "summary_content": "Today's conversation focused on project planning and team coordination. Key decisions included finalizing the Q1 roadmap and assigning responsibilities for the new feature development. Action items: John to prepare technical specifications by Friday, Sarah to coordinate with the design team. Overall sentiment was positive with good team engagement.",
    "message_count": 45,
    "participants_involved": ["John Doe", "Sarah Smith", "Mike Johnson"],
    "created_at": "2024-01-15T12:00:00Z"
  },
  "message": "Summary generated successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 2. List Summaries

**GET** `/api/summaries/generate`

Retrieve a paginated list of generated summaries with optional filtering.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `chatJid` | string | No | Filter by chat JID |
| `summaryType` | string | No | Filter by summary type (daily, weekly, custom) |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/summaries/generate?page=1&limit=10&chatJid=1234567890@s.whatsapp.net&summaryType=daily" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "summaries": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "chat_jid": "1234567890@s.whatsapp.net",
        "summary_type": "daily",
        "summary_period_start": "2024-01-15T00:00:00Z",
        "summary_period_end": "2024-01-15T23:59:59Z",
        "summary_content": "Today's conversation focused on project planning...",
        "message_count": 45,
        "participants_involved": ["John Doe", "Sarah Smith"],
        "created_at": "2024-01-15T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 3. Get Summary

**GET** `/api/summaries/{id}`

Retrieve a specific summary by ID.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Summary ID |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/summaries/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "chat_jid": "1234567890@s.whatsapp.net",
    "summary_type": "daily",
    "summary_period_start": "2024-01-15T00:00:00Z",
    "summary_period_end": "2024-01-15T23:59:59Z",
    "summary_content": "Today's conversation focused on project planning...",
    "message_count": 45,
    "participants_involved": ["John Doe", "Sarah Smith"],
    "created_at": "2024-01-15T12:00:00Z"
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 4. Delete Summary

**DELETE** `/api/summaries/{id}`

Delete a specific summary by ID.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Summary ID |

#### Example Request

```bash
curl -X DELETE "http://localhost:3000/api/summaries/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": null,
  "message": "Summary deleted successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Data Types

### Generate Summary Request

```typescript
interface GenerateSummaryRequest {
  chatJid: string;                    // WhatsApp JID of the chat
  summaryType: 'daily' | 'weekly' | 'custom'; // Type of summary
  startDate?: string;                 // ISO date string (optional)
  endDate?: string;                   // ISO date string (optional)
  customPrompt?: string;              // Custom prompt for custom summaries
  includeParticipants?: boolean;      // Include participant names
}
```

### Summary Response

```typescript
interface SummaryResponse {
  id: string;                         // Summary ID
  chat_jid: string;                   // WhatsApp JID of the chat
  summary_type: 'daily' | 'weekly' | 'custom'; // Type of summary
  summary_period_start: string;       // Start date of summary period
  summary_period_end: string;         // End date of summary period
  summary_content: string;            // Generated summary text
  message_count: number;              // Number of messages summarized
  participants_involved: string[];    // List of participant names
  created_at: string;                 // Creation timestamp
}
```

## Summary Types and Defaults

### Daily Summary
- **Time Period**: Last 24 hours
- **Focus**: Key topics, decisions, action items, sentiment
- **Use Case**: Daily standups, quick updates

### Weekly Summary
- **Time Period**: Last 7 days
- **Focus**: Major themes, progress, trends, engagement levels
- **Use Case**: Weekly reports, team reviews

### Custom Summary
- **Time Period**: User-defined date range
- **Focus**: Custom prompt-driven analysis
- **Use Case**: Specific analysis needs, custom reporting

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Chat JID is required",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": "Chat not found",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### OpenAI Error (500)

```json
{
  "success": false,
  "error": "Failed to generate summary: Rate limit exceeded. Please try again later.",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## OpenAI Integration

The API integrates with OpenAI's GPT models to generate summaries:

- **Model**: Configurable via `OPENAI_MODEL` environment variable
- **Rate Limiting**: Built-in rate limiting to respect OpenAI API limits
- **Retry Logic**: Automatic retry with exponential backoff
- **Quality Validation**: Summary quality checks before storage
- **Cost Management**: Token usage tracking and optimization

## Message Processing

### Message Retrieval
1. Validates chat existence
2. Retrieves messages for specified time period
3. Filters out empty messages
4. Orders messages chronologically

### Message Transformation
- Extracts content, sender, timestamp, and message type
- Handles missing or null values gracefully
- Prepares messages for OpenAI processing

### Participant Information
- Extracts unique participant JIDs
- Looks up participant names from people table
- Falls back to JID if name not available

## Best Practices

1. **Use Appropriate Summary Types**: Choose daily for quick updates, weekly for comprehensive reviews
2. **Set Custom Date Ranges**: For custom summaries, always specify start and end dates
3. **Include Participants**: Enable participant information for better context
4. **Handle Rate Limits**: Implement retry logic for OpenAI API rate limits
5. **Validate Summaries**: Check summary quality before using in production
6. **Monitor Costs**: Track OpenAI API usage and costs
7. **Cache Results**: Consider caching frequently requested summaries

## Testing

Use the test endpoint to verify API functionality:

```bash
# Get API information
curl -X GET "http://localhost:3000/api/summaries/test"

# Test validation
curl -X POST "http://localhost:3000/api/summaries/test" \
  -H "Content-Type: application/json" \
  -d '{"testType": "validation"}'

# Get example request
curl -X POST "http://localhost:3000/api/summaries/test" \
  -H "Content-Type: application/json" \
  -d '{"testType": "example"}'
```

## Performance Considerations

- **Message Volume**: Large message volumes may impact processing time
- **OpenAI API**: Network latency and rate limits affect response times
- **Database Queries**: Optimized queries for message retrieval
- **Caching**: Consider implementing summary caching for frequently accessed data

## Security

- **Authentication**: All endpoints require valid Bearer tokens
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Secure error messages without exposing internals
- **Rate Limiting**: Built-in rate limiting to prevent abuse

## Future Enhancements

- **Bulk Summary Generation**: Generate summaries for multiple chats
- **Summary Templates**: Predefined summary templates for different use cases
- **Export Functionality**: Export summaries in various formats (PDF, CSV)
- **Advanced Analytics**: Sentiment analysis, topic extraction
- **Scheduled Summaries**: Automatic summary generation on schedule
- **Summary Comparison**: Compare summaries across time periods 