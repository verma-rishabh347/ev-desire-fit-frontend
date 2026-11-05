import { StrictMode, Suspense } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router";
import RootLayout from "./layouts/RootLayout";
import Spinner from "./components/Spinner";
import { routes } from "./routes";
const SpinnerFallback = () => (
  /* @__PURE__ */ <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);
const routeTree = [
  {
    element: (
      /* @__PURE__ */ <Suspense fallback={/* @__PURE__ */ <SpinnerFallback />}>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    children: routes,
  },
];
const handler = createStaticHandler(routeTree);
async function render(url) {
  const context = await handler.query(new Request(`http://ssr${url}`));
  if (context instanceof Response) {
    return {
      html: "",
      head: "",
      status: context.status,
      redirect: context.headers.get("Location") ?? void 0,
    };
  }
  const router = createStaticRouter(routeTree, context);
  const helmetContext = {};
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
  const html = renderToString(
    /* @__PURE__ */ <StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <StaticRouterProvider router={router} context={context} />
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>,
  );
  const h = helmetContext.helmet;
  const head = h
    ? [
        h.title?.toString() ?? "",
        h.meta?.toString() ?? "",
        h.link?.toString() ?? "",
        h.script?.toString() ?? "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  return {
    html,
    head,
    status: context.statusCode ?? 200,
  };
}
export { render };
