'use client';

import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import theme from '@/lib/chakra';

interface ChakraProviderProps {
  children: React.ReactNode;
}

export function ChakraProvider({ children }: ChakraProviderProps) {
  return (
    <CacheProvider>
      <ChakraUIProvider theme={theme}>
        {children}
      </ChakraUIProvider>
    </CacheProvider>
  );
} 