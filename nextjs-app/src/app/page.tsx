'use client';

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, indigo.100)',
    'linear(to-br, gray.900, gray.800)'
  );
  const headerBg = useColorModeValue('whiteAlpha.800', 'gray.900Alpha.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Box
        as="header"
        bg={headerBg}
        backdropFilter="blur(8px)"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex justify="space-between" align="center" py={6}>
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="green.500"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="sm">
                  W
                </Text>
              </Box>
              <Heading size="md" color={textColor}>
                WhatsApp Bridge
              </Heading>
            </HStack>
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              <Link href="/dashboard">
                <Text
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                  transition="colors"
                >
                  Dashboard
                </Text>
              </Link>
              <Link href="/contacts">
                <Text
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                  transition="colors"
                >
                  Contacts
                </Text>
              </Link>
              <Link href="/auth">
                <Text
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                  transition="colors"
                >
                  Login
                </Text>
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box as="main" py={20}>
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <VStack spacing={8} textAlign="center">
            <VStack spacing={6}>
              <Heading
                size="2xl"
                color={textColor}
                fontSize={{ base: '4xl', md: '6xl' }}
              >
                WhatsApp Bridge &
                <Text as="span" display="block" color="brand.500">
                  Business Intelligence
                </Text>
              </Heading>
              <Text
                fontSize="xl"
                color={mutedTextColor}
                maxW="3xl"
                mx="auto"
              >
                Seamlessly integrate WhatsApp conversations with powerful business intelligence capabilities. 
                Automate message summarization, track engagement, and gain valuable insights from your communications.
              </Text>
            </VStack>
            
            <HStack spacing={4} direction={{ base: 'column', sm: 'row' }}>
              <Link href="/dashboard">
                <Button size="lg" colorScheme="brand">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </HStack>
          </VStack>

          {/* Features Grid */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={8}
            mt={20}
          >
            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <VStack align="start" spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    bg="blue.100"
                    _dark={{ bg: 'blue.900' }}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xl">💬</Text>
                  </Box>
                  <VStack align="start" spacing={2}>
                    <Heading size="md" color={textColor}>
                      Message Intelligence
                    </Heading>
                    <Text color={mutedTextColor}>
                      AI-powered message summarization and insights using OpenAI integration.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <VStack align="start" spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    bg="green.100"
                    _dark={{ bg: 'green.900' }}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xl">📊</Text>
                  </Box>
                  <VStack align="start" spacing={2}>
                    <Heading size="md" color={textColor}>
                      Business Analytics
                    </Heading>
                    <Text color={mutedTextColor}>
                      Track engagement metrics, identify decision makers, and analyze communication patterns.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                shadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <VStack align="start" spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    bg="purple.100"
                    _dark={{ bg: 'purple.900' }}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xl">🤖</Text>
                  </Box>
                  <VStack align="start" spacing={2}>
                    <Heading size="md" color={textColor}>
                      Automated Recaps
                    </Heading>
                    <Text color={mutedTextColor}>
                      Generate and send periodic summaries to relevant chats automatically.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg={headerBg}
        backdropFilter="blur(8px)"
        borderTop="1px"
        borderColor={borderColor}
        mt={20}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
          <Text textAlign="center" color={mutedTextColor}>
            &copy; 2024 WhatsApp Bridge. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
