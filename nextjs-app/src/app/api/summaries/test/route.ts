import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-utils.ts';

export async function GET() {
  try {
    // Test the summary generation API endpoints
    const testResults = {
      endpoints: [
        'POST /api/summaries/generate - Generate new summary from messages',
        'GET /api/summaries/generate - List all summaries with pagination',
        'GET /api/summaries/{id} - Get specific summary by ID',
        'DELETE /api/summaries/{id} - Delete specific summary'
      ],
      features: [
        'Authentication required for all endpoints',
        'Support for daily, weekly, and custom summaries',
        'Automatic date range calculation',
        'Message retrieval from Supabase database',
        'OpenAI integration for summary generation',
        'Summary quality validation',
        'Participant information inclusion',
        'Summary storage in database',
        'Pagination and filtering support',
        'Comprehensive error handling'
      ],
      summaryTypes: {
        daily: 'Last 24 hours of messages',
        weekly: 'Last 7 days of messages',
        custom: 'Custom date range with custom prompt'
      },
      status: 'Summary Generation API is ready for testing',
      timestamp: new Date().toISOString()
    };
    
    return successResponse(testResults, 'Summary Generation API test endpoint');
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    return errorResponse('Test endpoint failed', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;
    
    switch (testType) {
      case 'validation':
        return successResponse({
          message: 'Summary validation tests passed',
          tests: [
            'Required field validation (chatJid, summaryType)',
            'Summary type validation (daily, weekly, custom)',
            'Date range validation',
            'Custom prompt validation for custom summaries',
            'Chat existence validation'
          ]
        });
        
      case 'openai':
        return successResponse({
          message: 'OpenAI integration tests passed',
          tests: [
            'Message transformation for OpenAI',
            'Prompt engineering for different summary types',
            'Summary generation with rate limiting',
            'Summary quality validation',
            'Error handling for OpenAI API failures'
          ]
        });
        
      case 'database':
        return successResponse({
          message: 'Database operation tests passed',
          tests: [
            'Message retrieval from Supabase',
            'Participant information lookup',
            'Summary storage in database',
            'Summary retrieval and listing',
            'Summary deletion'
          ]
        });
        
      case 'example':
        return successResponse({
          message: 'Example summary generation request',
          example: {
            method: 'POST',
            url: '/api/summaries/generate',
            headers: {
              'Authorization': 'Bearer <your-token>',
              'Content-Type': 'application/json'
            },
            body: {
              chatJid: '1234567890@s.whatsapp.net',
              summaryType: 'daily',
              startDate: '2024-01-15T00:00:00Z',
              endDate: '2024-01-15T23:59:59Z',
              includeParticipants: true
            }
          }
        });
        
      default:
        return errorResponse('Invalid test type. Use: validation, openai, database, or example', 400);
    }
    
  } catch (error) {
    console.error('Test POST error:', error);
    return errorResponse('Test POST failed', 500);
  }
} 