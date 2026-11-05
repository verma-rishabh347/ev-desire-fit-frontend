import { StrictMode } from "react";
import "./styles/globals.css";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiroErrorBoundary from "../export-plugins/AiroErrorBoundary";
import App from "./App";
if (import.meta.env.MODE === "development") {
  const meta = document.createElement("meta");
  meta.name = "robots";
  meta.content = "noindex, nofollow";
  document.head.appendChild(meta);
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      gcTime: 1e3 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");
const providers = (
  /* @__PURE__ */ <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </HelmetProvider>
);
const tree = (
  /* @__PURE__ */ <StrictMode>
    {import.meta.env.MODE === "development" ? (
      /* @__PURE__ */ <AiroErrorBoundary>{providers}</AiroErrorBoundary>
    ) : (
      providers
    )}
  </StrictMode>
);
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
