import { jsx } from "react/jsx-runtime";
import { RouterProvider } from "react-router/dom";
function AiroRouterProvider({
  router,
  ...providerProps
}) {
  return /* @__PURE__ */ jsx(RouterProvider, { router, ...providerProps });
}
export {
  AiroRouterProvider
};
