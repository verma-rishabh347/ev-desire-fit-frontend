import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AiroErrorBoundary from "../export-plugins/AiroErrorBoundary";
import CookieBannerErrorBoundary from "@/components/CookieBannerErrorBoundary";
import RootLayout from "./layouts/RootLayout";
import Spinner from "./components/Spinner";
import { routes } from "./routes";
const CookieBanner = lazy(() =>
  import("@/components/CookieBanner").catch((error) => {
    console.warn("Failed to load CookieBanner:", error);
    return {
      default: () => null,
    };
  }),
);
const SpinnerFallback = () => (
  /* @__PURE__ */ <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);
const rootElement = (
  /* @__PURE__ */ <Suspense fallback={/* @__PURE__ */ <SpinnerFallback />}>
    <RootLayout>
      <Outlet />
    </RootLayout>
  </Suspense>
);
const routeTree = [
  {
    element:
      import.meta.env.MODE === "development" ? (
        /* @__PURE__ */ <AiroErrorBoundary captureGlobalErrors={false}>
          {rootElement}
        </AiroErrorBoundary>
      ) : (
        rootElement
      ),
    children: routes,
  },
];
const router = createBrowserRouter(routeTree);
function App() {
  return (
    /* @__PURE__ */ <>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </>
  );
}
export { App as default };
