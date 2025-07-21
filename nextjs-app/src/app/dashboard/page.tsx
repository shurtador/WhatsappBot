'use client';

import React from 'react';
import { Box, Heading, Text, Button, VStack, HStack, Avatar, Divider } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function DashboardContent() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box maxW="4xl" mx="auto" p={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg">Dashboard</Heading>
          <Button colorScheme="red" onClick={handleLogout}>
            Sign Out
          </Button>
        </HStack>
        
        <Divider />
        
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="start">
            <Heading size="md">User Information</Heading>
            <HStack spacing={4}>
              <Avatar size="md" name={user?.email || 'User'} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Email:</Text>
                <Text>{user?.email}</Text>
              </VStack>
            </HStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">User ID:</Text>
              <Text fontSize="sm" color="gray.600">{user?.id}</Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Last Sign In:</Text>
              <Text fontSize="sm" color="gray.600">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
              </Text>
            </VStack>
          </VStack>
        </Box>
        
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="start">
            <Heading size="md">WhatsApp Bridge Status</Heading>
            <Text>Authentication successful! You can now access the WhatsApp Bridge features.</Text>
            <Text fontSize="sm" color="gray.600">
              This is a protected page. Only authenticated users can see this content.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
} 