import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
function PageNotFound() {
  return /* @__PURE__ */ jsxs("main", { className: "flex min-h-screen flex-col items-center justify-center p-8 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "The page you requested does not exist." }),
    /* @__PURE__ */ jsx(Link, { className: "mt-4 underline", to: "/", children: "Go home" })
  ] });
}
export {
  PageNotFound as default
};
