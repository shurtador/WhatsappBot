'use client';

import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const { signInWithMagicLink, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={24} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} size="lg" textAlign="center">Sign in to WhatsApp Bridge</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            isDisabled={loading || success}
            autoFocus
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          width="100%"
          isLoading={loading}
          isDisabled={loading || success || !email}
        >
          Send Magic Link
        </Button>
      </form>
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {success && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          Magic link sent! Check your email to sign in.
        </Alert>
      )}
      {loading && !success && (
        <Box textAlign="center" mt={4}><Spinner /></Box>
      )}
      <Text mt={8} fontSize="sm" color="gray.500" textAlign="center">
        Enter your email to receive a sign-in link. No password required.
      </Text>
    </Box>
  );
} 