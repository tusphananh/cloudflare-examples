'use client';

import BottomNavBar from '@/components/navbar/bottom-navbar';
import TopNavBar from '@/components/navbar/top-navbar';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TopNavBar />
        <QueryClientProvider client={queryClient}>
          <div className="safe-area px-4 flex flex-col min-h-screen">
            {children}
          </div>
          <BottomNavBar />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
