import { RouteObject } from 'react-router';
import HomePage from './pages/index';
import ProductsPage from './pages/products';
import ProductDetailsPage from './pages/product-details';
import IndustriesPage from './pages/industries';
import AboutPage from './pages/about';
import ContactPage from './pages/contact';
import SolutionsPage from './pages/solutions';
import ResourcesPage from './pages/resources';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailsPage />,
  },
  {
    path: '/industries',
    element: <IndustriesPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/solutions',
    element: <SolutionsPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/resources',
    element: <ResourcesPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/products' | '/industries' | '/about' | '/contact' | '/solutions' | '/resources';

export type Params = Record<string, string | undefined>;
