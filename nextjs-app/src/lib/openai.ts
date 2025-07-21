import OpenAI from 'openai';
import { env } from '@/utils/env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Summary types
export type SummaryType = 'daily' | 'weekly' | 'custom';

// Message structure for summarization
export interface MessageForSummary {
  content: string;
  sender_name: string;
  timestamp: string;
  is_from_me: boolean;
}

// Summary request interface
export interface SummaryRequest {
  messages: MessageForSummary[];
  summaryType: SummaryType;
  chatName?: string;
  customPrompt?: string;
}

// Summary response interface
export interface SummaryResponse {
  summary: string;
  messageCount: number;
  participants: string[];
  cost?: number;
  model?: string;
}

// Rate limiting utility
class RateLimiter {
  private lastRequestTime = 0;

  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

// Prompt engineering for different summary types
function createPrompt(request: SummaryRequest): string {
  const { messages, summaryType, chatName, customPrompt } = request;
  
  const basePrompt = `You are an AI assistant that creates concise, professional summaries of WhatsApp conversations. 
  
Context: ${chatName ? `Chat: ${chatName}` : 'WhatsApp conversation'}

Messages to summarize:
${messages.map(msg => 
  `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender_name}: ${msg.content}`
).join('\n')}

Instructions:`;

  switch (summaryType) {
    case 'daily':
      return `${basePrompt}
Create a daily summary that includes:
- Key topics discussed
- Important decisions made
- Action items or next steps
- Participants involved
- Overall sentiment/tone

Format as a professional business summary. Keep it concise but comprehensive.`;
    
    case 'weekly':
      return `${basePrompt}
Create a weekly summary that includes:
- Major themes and topics covered
- Progress on ongoing discussions
- Key decisions and outcomes
- Action items and deadlines
- Participant engagement levels
- Trends or patterns noticed

Format as a comprehensive weekly report suitable for business review.`;
    
    case 'custom':
      return `${basePrompt}
${customPrompt || 'Create a custom summary based on the conversation content.'}

Format as requested in the custom prompt.`;
    
    default:
      return `${basePrompt}
Create a general summary of the conversation highlighting key points and important information.`;
  }
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Main summarization function
export async function generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
  try {
    // Wait for rate limit
    await rateLimiter.waitForRateLimit();
    
    // Filter out empty messages and prepare for summarization
    const validMessages = request.messages.filter(msg => 
      msg.content && msg.content.trim().length > 0
    );
    
    if (validMessages.length === 0) {
      throw new Error('No valid messages to summarize');
    }
    
    // Create the prompt
    const prompt = createPrompt(request);
    
    // Generate summary with retry logic
    const completion = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional business communication analyst. Create clear, concise summaries that highlight key information and actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more consistent summaries
      });
    });
    
    // Extract unique participants
    const participants = [...new Set(validMessages.map(msg => msg.sender_name))];
    
    // Calculate estimated cost (rough approximation)
    const inputTokens = prompt.length / 4; // Rough token estimation
    const outputTokens = completion.usage?.completion_tokens || 0;
    const model = completion.model;
    
    return {
      summary: completion.choices[0]?.message?.content || 'No summary generated',
      messageCount: validMessages.length,
      participants,
      model,
    };
    
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      } else if (error.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenAI account.');
      }
    }
    
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Summary quality validation
export function validateSummary(summary: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!summary || summary.trim().length === 0) {
    issues.push('Summary is empty');
  }
  
  if (summary.length < 50) {
    issues.push('Summary is too short (less than 50 characters)');
  }
  
  if (summary.length > 2000) {
    issues.push('Summary is too long (more than 2000 characters)');
  }
  
  // Check for common issues
  if (summary.includes('I apologize') || summary.includes('I cannot')) {
    issues.push('Summary contains error messages');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Health check function
export async function checkOpenAIHealth(): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
    return false;
  }
} 