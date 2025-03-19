"use client";

import { QueryClient, QueryClientProvider } from "react-query";

const ReactQueryProvider = ({ children }) => {
  const client = new QueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
