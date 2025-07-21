import { NextRequest, NextResponse } from 'next/server';
import { checkOpenAIHealth, generateSummary, SummaryType } from '@/lib/openai';

export async function GET() {
  try {
    // Test OpenAI connection
    const isHealthy = await checkOpenAIHealth();
    
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'OpenAI service is not available' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'OpenAI integration is working correctly',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      { error: 'Failed to test OpenAI integration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, summaryType = 'daily' as SummaryType, chatName } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    // Generate a test summary
    const summary = await generateSummary({
      messages,
      summaryType,
      chatName
    });
    
    return NextResponse.json({
      status: 'success',
      summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 