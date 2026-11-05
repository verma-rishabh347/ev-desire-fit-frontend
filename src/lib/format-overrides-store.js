import { useSyncExternalStore } from "react";
import initialFormatOverrideBundle from "virtual:format-overrides";
const FORMAT_OVERRIDES_UPDATE_EVENT = "format-overrides:update";
const FORMAT_OVERRIDES_WILL_UPDATE_EVENT = "airo-format-overrides:will-update";
const listeners = /* @__PURE__ */ new Set();
let currentBundle = initialFormatOverrideBundle;
function getFormatOverrideBundle() {
  return currentBundle;
}
function subscribeFormatOverrideBundle(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function setFormatOverrideBundle(bundle) {
  currentBundle = bundle;
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(FORMAT_OVERRIDES_WILL_UPDATE_EVENT, { detail: bundle }),
    );
  }
  listeners.forEach((listener) => listener());
}
function useFormatOverrideBundle() {
  return useSyncExternalStore(
    subscribeFormatOverrideBundle,
    getFormatOverrideBundle,
    getFormatOverrideBundle,
  );
}
if (import.meta.hot) {
  import.meta.hot.on(FORMAT_OVERRIDES_UPDATE_EVENT, (bundle) => {
    setFormatOverrideBundle(bundle);
  });
}
export {
  FORMAT_OVERRIDES_UPDATE_EVENT,
  FORMAT_OVERRIDES_WILL_UPDATE_EVENT,
  getFormatOverrideBundle,
  setFormatOverrideBundle,
  subscribeFormatOverrideBundle,
  useFormatOverrideBundle,
};
