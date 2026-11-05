import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EMPTY_FORMAT_OVERRIDE_BUNDLE,
  buildFormatOverrideStyle,
  deriveFormatOverrideScope,
  findApplicableFormatOverride,
  targetsMatch,
} from "../format-overrides";
import {
  SIZE_SCALE,
  lineHeightForFontSize,
  remForSizeClass,
} from "../text-size";
const expressionHash = `sha256:${"a".repeat(64)}`;
const differentExpressionHash = `sha256:${"b".repeat(64)}`;
const target = {
  file: "src/pages/index.jsx",
  tagName: "h1",
  sourceKind: "bound-expression",
  contentKey: null,
  contentKeyTemplate: null,
  expressionHash,
};
describe("format override runtime helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("returns missing for absent sidecar entries", () => {
    expect(
      findApplicableFormatOverride(
        EMPTY_FORMAT_OVERRIDE_BUNDLE,
        "abc123",
        target,
      ),
    ).toEqual({
      status: "missing",
    });
  });
  it("returns applicable marks when every guard field matches", () => {
    const sidecar = {
      version: 1,
      overrides: {
        abc123: {
          target,
          marks: { bold: true, italic: true, color: "#123abc" },
          updatedAt: "2026-05-28T12:00:00.000Z",
        },
      },
    };
    const bundle = { version: 1, scopes: { "pages/index": sidecar } };
    expect(findApplicableFormatOverride(bundle, "abc123", target)).toEqual({
      status: "applicable",
      marks: { bold: true, italic: true, color: "#123abc" },
    });
  });
  it("returns guard-mismatch when a stale structural id points at a different expression", () => {
    const sidecar = {
      version: 1,
      overrides: {
        abc123: {
          target,
          marks: { bold: true, italic: false, color: null },
          updatedAt: "2026-05-28T12:00:00.000Z",
        },
      },
    };
    const bundle = { version: 1, scopes: { "pages/index": sidecar } };
    const actual = { ...target, expressionHash: differentExpressionHash };
    expect(findApplicableFormatOverride(bundle, "abc123", actual)).toEqual({
      status: "guard-mismatch",
      expected: target,
      actual,
    });
  });
  it("fails open when a top-level valid sidecar contains a malformed entry", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const bundle = {
      version: 1,
      scopes: {
        "pages/index": {
          version: 1,
          overrides: {
            abc123: {},
          },
        },
      },
    };
    expect(findApplicableFormatOverride(bundle, "abc123", target)).toEqual({
      status: "missing",
    });
    expect(warn).toHaveBeenCalledWith(
      "[format-overrides] Ignoring malformed override entry.",
      { scope: "pages/index", devId: "abc123" },
    );
  });
  it.each([
    ["file", { file: "src/pages/about.jsx" }],
    ["tagName", { tagName: "p" }],
    ["sourceKind", { sourceKind: "content-key" }],
    ["contentKey", { contentKey: "home.title" }],
    ["contentKeyTemplate", { contentKeyTemplate: "products[].name" }],
    ["expressionHash", { expressionHash: differentExpressionHash }],
  ])("returns false when target %s differs", (_field, patch) => {
    expect(targetsMatch(target, { ...target, ...patch })).toBe(false);
  });
  it("treats null and undefined optional target fields as equivalent", () => {
    const expected = {
      ...target,
      contentKey: void 0,
      contentKeyTemplate: void 0,
      expressionHash: void 0,
    };
    const actual = {
      ...target,
      contentKey: null,
      contentKeyTemplate: null,
      expressionHash: null,
    };
    expect(targetsMatch(expected, actual)).toBe(true);
  });
  it("builds inline styles for the v1 mark set only", () => {
    expect(
      buildFormatOverrideStyle({ bold: true, italic: true, color: "#123abc" }),
    ).toEqual({
      fontWeight: 700,
      fontStyle: "italic",
      color: "#123abc",
    });
  });
  it("emits the paired line-height for every size on the scale", () => {
    const expected = {
      "0.75rem": "1rem",
      "0.875rem": "1.25rem",
      "1rem": "1.5rem",
      "1.125rem": "1.75rem",
      "1.25rem": "1.75rem",
      "1.5rem": "2rem",
      "1.875rem": "2.25rem",
      "2.25rem": "2.5rem",
      "3rem": "1",
      "3.75rem": "1",
      "4.5rem": "1",
      "6rem": "1",
      "8rem": "1",
    };
    for (const [rem, lineHeight] of Object.entries(expected)) {
      const style = buildFormatOverrideStyle({ fontSize: rem });
      expect(style.fontSize).toBe(rem);
      expect(String(style.lineHeight)).toBe(lineHeight);
    }
  });
  it("does not emit fontSize or lineHeight for a size-less mark set", () => {
    const style = buildFormatOverrideStyle({ bold: true });
    expect(style).not.toHaveProperty("fontSize");
    expect(style).not.toHaveProperty("lineHeight");
  });
  it("emits fontSize but no lineHeight for a valid off-scale rem", () => {
    const style = buildFormatOverrideStyle({ fontSize: "2rem" });
    expect(style.fontSize).toBe("2rem");
    expect(style).not.toHaveProperty("lineHeight");
  });
  it("emits the same line-height the dev-tools preview uses, for every stepper size", () => {
    for (const size of SIZE_SCALE) {
      const rem = remForSizeClass(size);
      const published = String(
        buildFormatOverrideStyle({ fontSize: rem }).lineHeight,
      );
      expect(published).toBe(lineHeightForFontSize(rem));
    }
  });
  it("rejects an override entry whose fontSize mark is the wrong type (isFormatOverrideMarks)", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const bundle = {
      version: 1,
      scopes: {
        "pages/index": {
          version: 1,
          overrides: {
            abc123: {
              target,
              marks: { fontSize: 42 },
              updatedAt: "2026-05-28T12:00:00.000Z",
            },
          },
        },
      },
    };
    expect(findApplicableFormatOverride(bundle, "abc123", target)).toEqual({
      status: "missing",
    });
  });
  it("accepts an override entry with a correctly-typed string fontSize mark", () => {
    const bundle = {
      version: 1,
      scopes: {
        "pages/index": {
          version: 1,
          overrides: {
            abc123: {
              target,
              marks: { fontSize: "1.875rem" },
              updatedAt: "2026-05-28T12:00:00.000Z",
            },
          },
        },
      },
    };
    expect(findApplicableFormatOverride(bundle, "abc123", target)).toEqual({
      status: "applicable",
      marks: { fontSize: "1.875rem" },
    });
  });
  it("derives scoped sidecar locations from source files", () => {
    expect(deriveFormatOverrideScope("src/pages/index.jsx")).toEqual({
      key: "pages/index",
      filePath: "format-overrides/pages/index.json",
    });
    expect(deriveFormatOverrideScope("src/pages/about.jsx")).toEqual({
      key: "pages/about",
      filePath: "format-overrides/pages/about.json",
    });
    expect(deriveFormatOverrideScope("src/pages/home.jsx")).toEqual({
      key: "pages/home",
      filePath: "format-overrides/pages/home.json",
    });
    expect(deriveFormatOverrideScope("src/pages/blog/index.jsx")).toEqual({
      key: "pages/blog/index",
      filePath: "format-overrides/pages/blog/index.json",
    });
    expect(deriveFormatOverrideScope("src/layouts/RootLayout.jsx")).toEqual({
      key: "shared",
      filePath: "format-overrides/shared.json",
    });
    expect(deriveFormatOverrideScope("src/pages/../secret.jsx")).toEqual({
      key: "shared",
      filePath: "format-overrides/shared.json",
    });
    expect(deriveFormatOverrideScope("src/pages/blog/[slug].jsx")).toEqual({
      key: "shared",
      filePath: "format-overrides/shared.json",
    });
    expect(deriveFormatOverrideScope("src/pages/blog/post.draft.jsx")).toEqual({
      key: "shared",
      filePath: "format-overrides/shared.json",
    });
  });
});
