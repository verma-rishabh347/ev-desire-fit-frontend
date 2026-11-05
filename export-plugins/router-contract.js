import { createBrowserRouter } from 'react-router';

/** Standalone router factory without AAB preview instrumentation. */
export function createAiroBrowserRouter(
  routes,
  options,
) {
  const { notFoundRouteId: _notFoundRouteId, patchRoutesOnNavigation, ...routerOptions } = options;
  if (patchRoutesOnNavigation !== undefined) {
    throw new Error('createAiroBrowserRouter does not support patchRoutesOnNavigation');
  }
  return createBrowserRouter(routes, routerOptions);
}
