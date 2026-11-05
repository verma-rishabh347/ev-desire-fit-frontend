import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setFormatOverrideBundle } from "../../lib/format-overrides-store";
import { FormattedBoundText } from "../FormattedBoundText";
const { initialBundle } = vi.hoisted(() => ({
  initialBundle: {
    version: 1,
    scopes: {
      "pages/index": {
        version: 1,
        overrides: {
          abc123: {
            target: {
              file: "src/pages/index.jsx",
              tagName: "h1",
              sourceKind: "bound-expression",
              contentKey: null,
              contentKeyTemplate: null,
              expressionHash: `sha256:${"a".repeat(64)}`,
            },
            marks: {
              bold: true,
              italic: true,
              color: "#123abc",
            },
            updatedAt: "2026-05-28T12:00:00.000Z",
          },
          stale: {
            target: {
              file: "src/pages/index.jsx",
              tagName: "p",
              sourceKind: "bound-expression",
              contentKey: null,
              contentKeyTemplate: null,
              expressionHash: `sha256:${"b".repeat(64)}`,
            },
            marks: {
              bold: true,
            },
            updatedAt: "2026-05-28T12:00:00.000Z",
          },
        },
      },
    },
  },
}));
vi.mock("virtual:format-overrides", () => ({
  default: initialBundle,
}));
const guard = {
  file: "src/pages/index.jsx",
  tagName: "h1",
  sourceKind: "bound-expression",
  contentKey: null,
  contentKeyTemplate: null,
  expressionHash: `sha256:${"a".repeat(64)}`,
};
describe("FormattedBoundText", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setFormatOverrideBundle(initialBundle);
  });
  it("renders children unchanged when no override exists", () => {
    const { container } = render(
      /* @__PURE__ */ <FormattedBoundText devId="missing" guard={guard}>
        Site title
      </FormattedBoundText>,
    );
    expect(
      container.querySelector("[data-airo-formatted-bound-text]"),
    ).toBeNull();
    expect(container.textContent).toBe("Site title");
  });
  it("wraps children and applies matching override marks", () => {
    render(
      /* @__PURE__ */ <FormattedBoundText devId="abc123" guard={guard}>
        Site title
      </FormattedBoundText>,
    );
    const formatted = screen.getByText("Site title");
    expect(formatted).toHaveAttribute("data-airo-formatted-bound-text", "true");
    expect(formatted).toHaveAttribute("data-airo-format-bold", "true");
    expect(formatted).toHaveAttribute("data-airo-format-italic", "true");
    expect(formatted).toHaveAttribute("data-airo-format-color", "#123abc");
    expect(formatted).toHaveStyle({
      fontWeight: "700",
      fontStyle: "italic",
      color: "#123abc",
    });
  });
  it("applies a fontSize mark as data-airo-format-size plus paired inline font-size and line-height", () => {
    setFormatOverrideBundle({
      version: 1,
      scopes: {
        "pages/index": {
          version: 1,
          overrides: {
            sized: {
              target: guard,
              marks: {
                fontSize: "1.875rem",
              },
              updatedAt: "2026-05-28T12:00:00.000Z",
            },
          },
        },
      },
    });
    render(
      /* @__PURE__ */ <FormattedBoundText devId="sized" guard={guard}>
        Site title
      </FormattedBoundText>,
    );
    const formatted = screen.getByText("Site title");
    expect(formatted).toHaveAttribute("data-airo-format-size", "1.875rem");
    expect(formatted).toHaveStyle({
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
    });
  });
  it("renders children unchanged and warns in dev on guard mismatch", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      /* @__PURE__ */ <FormattedBoundText devId="stale" guard={guard}>
        Site title
      </FormattedBoundText>,
    );
    expect(
      container.querySelector("[data-airo-formatted-bound-text]"),
    ).toBeNull();
    expect(container.textContent).toBe("Site title");
    expect(warn).toHaveBeenCalledWith(
      "[format-overrides] Ignoring stale override for bound text.",
      expect.objectContaining({
        devId: "stale",
      }),
    );
  });
  it("updates rendered marks when the format override bundle changes", () => {
    render(
      /* @__PURE__ */ <FormattedBoundText devId="missing" guard={guard}>
        Site title
      </FormattedBoundText>,
    );
    expect(screen.getByText("Site title")).not.toHaveAttribute(
      "data-airo-formatted-bound-text",
    );
    act(() => {
      setFormatOverrideBundle({
        version: 1,
        scopes: {
          "pages/index": {
            version: 1,
            overrides: {
              missing: {
                target: guard,
                marks: {
                  italic: true,
                },
                updatedAt: "2026-05-28T12:00:00.000Z",
              },
            },
          },
        },
      });
    });
    const formatted = screen.getByText("Site title");
    expect(formatted).toHaveAttribute("data-airo-formatted-bound-text", "true");
    expect(formatted).toHaveAttribute("data-airo-format-italic", "true");
    expect(formatted).toHaveStyle({
      fontStyle: "italic",
    });
  });
});
