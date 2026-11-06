import HomePage from "./pages/index";
import ProductsPage from "./pages/products";
import ProductDetailsPage from "./pages/product-details";
import IndustriesPage from "./pages/industries";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import SolutionsPage from "./pages/solutions";
import ResourcesPage from "./pages/resources";
import TermsConditionsPage from "./pages/termsconditions";
import PrivacyPolicyPage from "./pages/privacypolicy";
import ProdNotFoundPage from "./pages/_404";
const NotFoundPage = ProdNotFoundPage;
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ <HomePage />,
  },
  {
    path: "/products",
    element: /* @__PURE__ */ <ProductsPage />,
  },
  {
    path: "/products/:slug",
    element: /* @__PURE__ */ <ProductDetailsPage />,
  },
  {
    path: "/industries",
    element: /* @__PURE__ */ <IndustriesPage />,
  },
  {
    path: "/about",
    element: /* @__PURE__ */ <AboutPage />,
  },
  {
    path: "/solutions",
    element: /* @__PURE__ */ <SolutionsPage />,
  },
  {
    path: "/contact",
    element: /* @__PURE__ */ <ContactPage />,
  },
  {
    path: "/resources",
    element: /* @__PURE__ */ <ResourcesPage />,
  },
  {
    path: "/termsconditions",
    element: /* @__PURE__ */ <TermsConditionsPage />,
  },
  {
    path: "/privacypolicy",
    element: /* @__PURE__ */ <PrivacyPolicyPage />,
  },
  {
    path: "*",
    element: /* @__PURE__ */ <NotFoundPage />,
  },
];
export { routes };
