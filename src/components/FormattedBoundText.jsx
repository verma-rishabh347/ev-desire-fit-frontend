import {
  buildFormatOverrideStyle,
  findApplicableFormatOverride,
} from "@/lib/format-overrides";
import { useFormatOverrideBundle } from "@/lib/format-overrides-store";
function FormattedBoundText({ devId, guard, children }) {
  const formatOverrideBundle = useFormatOverrideBundle();
  const result = findApplicableFormatOverride(
    formatOverrideBundle,
    devId,
    guard,
  );
  if (result.status === "missing") {
    return /* @__PURE__ */ <>{children}</>;
  }
  if (result.status === "guard-mismatch") {
    if (import.meta.env.DEV) {
      console.warn(
        "[format-overrides] Ignoring stale override for bound text.",
        {
          devId,
          expected: result.expected,
          actual: result.actual,
        },
      );
    }
    return /* @__PURE__ */ <>{children}</>;
  }
  const marks = result.marks;
  return (
    /* @__PURE__ */ <span
      data-airo-formatted-bound-text="true"
      data-airo-format-bold={marks.bold ? "true" : void 0}
      data-airo-format-italic={marks.italic ? "true" : void 0}
      data-airo-format-color={marks.color || void 0}
      data-airo-format-size={marks.fontSize || void 0}
      style={buildFormatOverrideStyle(marks)}
    >
      {children}
    </span>
  );
}
export { FormattedBoundText };
