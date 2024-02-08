"use client";

import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export function QueryProvider({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
