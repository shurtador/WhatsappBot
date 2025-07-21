# Contact Management API Documentation

## Overview

The Contact Management API provides comprehensive functionality for managing WhatsApp contacts with business intelligence features. All endpoints require authentication via Bearer token.

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
http://localhost:3000/api/people
```

## Endpoints

### 1. List Contacts

**GET** `/api/people`

Retrieve a paginated list of contacts with optional search, filtering, and sorting.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `search` | string | No | Search across name, company, email |
| `tags` | string | No | Comma-separated list of tags to filter by |
| `company` | string | No | Filter by company name |
| `isDecisionMaker` | boolean | No | Filter by decision maker status |
| `sortBy` | string | No | Sort field (first_name, last_name, company, last_seen, created_at) |
| `sortOrder` | string | No | Sort order (asc, desc) |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/people?page=1&limit=10&search=john&tags=client,prospect&sortBy=last_seen&sortOrder=desc" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "jid": "1234567890@s.whatsapp.net",
      "phone_number": "+1234567890",
      "first_name": "John",
      "last_name": "Doe",
      "display_name": "John Doe",
      "company": "Acme Corp",
      "role": "Manager",
      "is_decision_maker": true,
      "email": "john.doe@acme.com",
      "notes": "Key decision maker",
      "tags": ["client", "decision-maker"],
      "last_seen": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "timestamp": "2024-01-15T12:00:00Z",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Create Contact

**POST** `/api/people`

Create a new contact.

#### Request Body

```json
{
  "jid": "1234567890@s.whatsapp.net",
  "phone_number": "+1234567890",
  "first_name": "John",
  "last_name": "Doe",
  "display_name": "John Doe",
  "company": "Acme Corp",
  "role": "Manager",
  "is_decision_maker": true,
  "email": "john.doe@acme.com",
  "notes": "Key decision maker",
  "tags": ["client", "decision-maker"]
}
```

#### Required Fields

- `jid`: WhatsApp JID (unique identifier)
- `phone_number`: International phone number format

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/people" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "jid": "1234567890@s.whatsapp.net",
    "phone_number": "+1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "company": "Acme Corp",
    "email": "john.doe@acme.com"
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "jid": "1234567890@s.whatsapp.net",
    "phone_number": "+1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": null,
    "company": "Acme Corp",
    "role": null,
    "is_decision_maker": false,
    "email": "john.doe@acme.com",
    "notes": null,
    "tags": [],
    "last_seen": "2024-01-15T12:00:00Z",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": null
  },
  "message": "Contact created successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 3. Get Contact

**GET** `/api/people/{jid}`

Retrieve a specific contact by JID.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jid` | string | Yes | WhatsApp JID of the contact |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/people/1234567890@s.whatsapp.net" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "jid": "1234567890@s.whatsapp.net",
    "phone_number": "+1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "company": "Acme Corp",
    "role": "Manager",
    "is_decision_maker": true,
    "email": "john.doe@acme.com",
    "notes": "Key decision maker",
    "tags": ["client", "decision-maker"],
    "last_seen": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 4. Update Contact

**PUT** `/api/people/{jid}`

Update an existing contact.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jid` | string | Yes | WhatsApp JID of the contact |

#### Request Body

All fields are optional. Only provided fields will be updated.

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "company": "Updated Corp",
  "is_decision_maker": false,
  "email": "jane.smith@updated.com",
  "notes": "Updated notes",
  "tags": ["updated", "client"]
}
```

#### Example Request

```bash
curl -X PUT "http://localhost:3000/api/people/1234567890@s.whatsapp.net" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "company": "Updated Corp",
    "is_decision_maker": false
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "jid": "1234567890@s.whatsapp.net",
    "phone_number": "+1234567890",
    "first_name": "Jane",
    "last_name": "Doe",
    "display_name": "John Doe",
    "company": "Updated Corp",
    "role": "Manager",
    "is_decision_maker": false,
    "email": "john.doe@acme.com",
    "notes": "Key decision maker",
    "tags": ["client", "decision-maker"],
    "last_seen": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "message": "Contact updated successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 5. Delete Contact

**DELETE** `/api/people/{jid}`

Delete a contact. Note: Contacts with message history cannot be deleted.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jid` | string | Yes | WhatsApp JID of the contact |

#### Example Request

```bash
curl -X DELETE "http://localhost:3000/api/people/1234567890@s.whatsapp.net" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": null,
  "message": "Contact deleted successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 6. Add Tags

**POST** `/api/people/{jid}/tags`

Add tags to a contact.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jid` | string | Yes | WhatsApp JID of the contact |

#### Request Body

```json
{
  "tags": ["client", "prospect", "vip"]
}
```

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/people/1234567890@s.whatsapp.net/tags" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["client", "vip"]
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": ["client", "decision-maker", "vip"],
  "message": "Tags added successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 7. Remove Tags

**DELETE** `/api/people/{jid}/tags`

Remove tags from a contact.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jid` | string | Yes | WhatsApp JID of the contact |

#### Request Body

```json
{
  "tags": ["prospect", "vip"]
}
```

#### Example Request

```bash
curl -X DELETE "http://localhost:3000/api/people/1234567890@s.whatsapp.net/tags" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["prospect"]
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": ["client", "decision-maker", "vip"],
  "message": "Tags removed successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 8. Contact Statistics

**GET** `/api/people/stats`

Get aggregated statistics about contacts.

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/people/stats" \
  -H "Authorization: Bearer <your-token>"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "total": 150,
    "withCompany": 120,
    "decisionMakers": 25,
    "withEmail": 80,
    "recentlyActive": 45,
    "byTag": {
      "client": 75,
      "prospect": 30,
      "vendor": 15,
      "decision-maker": 25,
      "vip": 10
    }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Error Responses

All endpoints return consistent error responses:

### Authentication Error (401)

```json
{
  "success": false,
  "error": "Missing or invalid authorization header",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "Invalid email format",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": "Contact not found",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Conflict Error (409)

```json
{
  "success": false,
  "error": "Contact already exists",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Failed to fetch contacts",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Data Types

### Contact Object

```typescript
interface Person {
  jid: string;                    // WhatsApp JID (primary key)
  phone_number: string;           // International phone number
  first_name: string | null;      // First name
  last_name: string | null;       // Last name
  display_name: string | null;    // WhatsApp display name
  company: string | null;         // Company name
  role: string | null;            // Job role
  is_decision_maker: boolean;     // Decision maker flag
  email: string | null;           // Email address
  notes: string | null;           // Additional notes
  tags: string[];                 // Array of tags
  last_seen: string;              // Last activity timestamp
  created_at: string;             // Creation timestamp
  updated_at: string | null;      // Last update timestamp
}
```

### Contact Statistics

```typescript
interface ContactStats {
  total: number;                  // Total number of contacts
  withCompany: number;            // Contacts with company info
  decisionMakers: number;         // Decision makers
  withEmail: number;              // Contacts with email
  recentlyActive: number;         // Active in last 30 days
  byTag: Record<string, number>;  // Tag distribution
}
```

## Validation Rules

### Email Validation
- Must be a valid email format
- Optional field

### Phone Number Validation
- Must be in international format
- Required field
- Example: `+1234567890`

### JID Validation
- Must be a valid WhatsApp JID format
- Required field
- Example: `1234567890@s.whatsapp.net`

### Tags Validation
- Must be non-empty strings
- Duplicate tags are automatically removed
- Array of strings

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Testing

Use the test endpoint to verify API functionality:

```bash
# Get API information
curl -X GET "http://localhost:3000/api/people/test"

# Test validation
curl -X POST "http://localhost:3000/api/people/test" \
  -H "Content-Type: application/json" \
  -d '{"testType": "validation"}'
```

## Best Practices

1. **Always include authentication**: All requests must include a valid Bearer token
2. **Use pagination**: For large datasets, use pagination to avoid performance issues
3. **Validate input**: Ensure all required fields are provided and properly formatted
4. **Handle errors**: Implement proper error handling for all API responses
5. **Use appropriate HTTP methods**: GET for retrieval, POST for creation, PUT for updates, DELETE for removal
6. **Cache when appropriate**: Consider caching frequently accessed data
7. **Monitor usage**: Track API usage and performance metrics

## Future Enhancements

- Bulk operations (create/update multiple contacts)
- Contact import/export functionality
- Advanced search with full-text search
- Contact relationship mapping
- Activity timeline
- Contact scoring and prioritization
- Integration with CRM systems 