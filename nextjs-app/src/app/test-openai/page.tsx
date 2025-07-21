'use client';

import React, { useState } from 'react';
import { Box, Button, Textarea, Heading, Text, VStack, HStack, Select, Alert, AlertIcon } from '@chakra-ui/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SummaryType } from '@/lib/openai';

function TestOpenAIContent() {
  const [messages, setMessages] = useState('');
  const [summaryType, setSummaryType] = useState<SummaryType>('daily');
  const [chatName, setChatName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleMessages = `[
  {
    "content": "Hi team, I wanted to discuss the Q4 project timeline",
    "sender_name": "John Doe",
    "timestamp": "2024-01-15T10:00:00Z",
    "is_from_me": false
  },
  {
    "content": "Great idea! I think we should aim to complete the first phase by end of January",
    "sender_name": "Jane Smith",
    "timestamp": "2024-01-15T10:05:00Z",
    "is_from_me": false
  },
  {
    "content": "Agreed. I'll create a detailed timeline and share it with everyone by tomorrow",
    "sender_name": "Mike Johnson",
    "timestamp": "2024-01-15T10:10:00Z",
    "is_from_me": false
  }
]`;

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let messagesToSend;
      try {
        messagesToSend = JSON.parse(messages);
      } catch (e) {
        throw new Error('Invalid JSON format for messages');
      }

      const response = await fetch('/api/openai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          summaryType,
          chatName: chatName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/openai/test');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Health check failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">OpenAI Integration Test</Heading>
        
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Health Check</Heading>
            <Button onClick={handleHealthCheck} isLoading={loading} colorScheme="blue">
              Test OpenAI Connection
            </Button>
          </VStack>
        </Box>

        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Summary Generation Test</Heading>
            
            <HStack spacing={4}>
              <Box flex={1}>
                <Text mb={2} fontWeight="bold">Summary Type:</Text>
                <Select 
                  value={summaryType} 
                  onChange={(e) => setSummaryType(e.target.value as SummaryType)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text mb={2} fontWeight="bold">Chat Name (optional):</Text>
                <Textarea
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Enter chat name"
                  rows={1}
                />
              </Box>
            </HStack>

            <Box>
              <Text mb={2} fontWeight="bold">Messages (JSON format):</Text>
              <Textarea
                value={messages}
                onChange={(e) => setMessages(e.target.value)}
                placeholder="Enter messages in JSON format"
                rows={10}
              />
              <Button 
                size="sm" 
                mt={2} 
                onClick={() => setMessages(sampleMessages)}
                variant="outline"
              >
                Load Sample Messages
              </Button>
            </Box>

            <Button onClick={handleTest} isLoading={loading} colorScheme="green">
              Generate Summary
            </Button>
          </VStack>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {result && (
          <Box p={6} borderWidth={1} borderRadius="lg" bg="gray.50">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Result</Heading>
              <Text fontWeight="bold">Status: {result.status}</Text>
              <Text fontWeight="bold">Timestamp: {result.timestamp}</Text>
              
              {result.summary && (
                <Box>
                  <Text fontWeight="bold">Generated Summary:</Text>
                  <Box p={4} bg="white" borderRadius="md" borderWidth={1}>
                    <Text whiteSpace="pre-wrap">{result.summary.summary}</Text>
                  </Box>
                  <Text mt={2} fontSize="sm" color="gray.600">
                    Message count: {result.summary.messageCount} | 
                    Participants: {result.summary.participants.join(', ')} | 
                    Model: {result.summary.model}
                  </Text>
                </Box>
              )}
              
              {result.message && (
                <Text>{result.message}</Text>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default function TestOpenAIPage() {
  return (
    <ProtectedRoute>
      <TestOpenAIContent />
    </ProtectedRoute>
  );
} 