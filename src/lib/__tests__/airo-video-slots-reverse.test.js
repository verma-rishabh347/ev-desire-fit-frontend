import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const SCRIPT = readFileSync(
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../public/airo-video-slots.js",
  ),
  "utf8",
);
const SLOT = "pages/home/hero";
function stubManifestFetch(...responses) {
  let call = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(function fetchManifest() {
      const body = responses[Math.min(call, responses.length - 1)];
      call += 1;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
    }),
  );
}
async function runScript() {
  new Function(SCRIPT)();
  await vi.advanceTimersByTimeAsync(0);
}
const NativeMutationObserver = globalThis.MutationObserver;
const observers = [];
beforeEach(function setup() {
  vi.useFakeTimers();
  HTMLMediaElement.prototype.load = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn();
  document.body.innerHTML = "";
  window.__AIRO_DEV_MODE__ = false;
  vi.stubGlobal(
    "MutationObserver",
    class TrackedMutationObserver extends NativeMutationObserver {
      constructor(callback) {
        super(callback);
        observers.push(this);
      }
    },
  );
});
afterEach(function teardown() {
  observers.forEach(function disconnect(observer) {
    observer.disconnect();
  });
  observers.length = 0;
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("airo-video-slots.js reverse reconciliation", function reverseTests() {
  it("reveals the hidden img and drops the injected video when the slot is an image", async function revealsImg() {
    document.body.innerHTML = `
      <div>
        <img src="/airo-assets/images/${SLOT}" data-airo-video-patched="true" style="display: none;" />
        <video data-airo-video="" data-slot="${SLOT}" src="/airo-assets/videos/${SLOT}"></video>
      </div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const img = document.querySelector("img");
    expect(document.querySelector("video")).toBeNull();
    expect(img.hasAttribute("data-airo-video-patched")).toBe(false);
    expect(img.style.display).toBe("");
  });
  it("replaces an agent-written <video> with an <img> on the image slot URL", async function replacesSourceVideo() {
    document.body.innerHTML = `<div><video src="/airo-assets/videos/${SLOT}" class="hero-media" aria-label="A sunny patio"></video></div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const img = document.querySelector("img");
    expect(document.querySelector("video")).toBeNull();
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe(`/airo-assets/images/${SLOT}`);
    expect(img.className).toBe("hero-media");
    expect(img.alt).toBe("A sunny patio");
  });
  it("leaves a video untouched when its slot is absent from the manifest", async function absentSlotGuard() {
    document.body.innerHTML = `<div><video src="/airo-assets/videos/${SLOT}"></video></div>`;
    stubManifestFetch({});
    await runScript();
    expect(document.querySelector("video")).not.toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });
  it("ignores dev-tools provisional preview nodes", async function skipsPreviewNodes() {
    document.body.innerHTML = `<div><video data-airo-media-preview="video" src="/airo-assets/videos/${SLOT}"></video></div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    expect(document.querySelector("video")).not.toBeNull();
  });
  it("restores the background image and clears the fill video for a background slot", async function restoresBackground() {
    document.body.innerHTML = `
      <section data-airo-video-bg-patched="${SLOT}" data-airo-bg-video-clear-bg="true" style="background-image: none; background-color: transparent;">
        <video data-airo-bg-video="" data-slot="${SLOT}" src="/airo-assets/videos/${SLOT}"></video>
      </section>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const section = document.querySelector("section");
    expect(section.querySelector("video[data-airo-bg-video]")).toBeNull();
    expect(section.hasAttribute("data-airo-video-bg-patched")).toBe(false);
    expect(section.hasAttribute("data-airo-bg-video-clear-bg")).toBe(false);
    expect(section.style.backgroundImage).toContain(
      `/airo-assets/images/${SLOT}`,
    );
  });
  it("heals a stale patch when the manifest poll reports the slot flipped to image", async function pollHeals() {
    document.body.innerHTML = `<div><img src="/airo-assets/images/${SLOT}" /></div>`;
    stubManifestFetch(
      { [SLOT]: { mediaType: "video" } },
      { [SLOT]: { mediaType: "image" } },
    );
    window.__AIRO_DEV_MODE__ = true;
    await runScript();
    const img = document.querySelector("img");
    expect(document.querySelector("video")).not.toBeNull();
    expect(img.style.display).toBe("none");
    await vi.advanceTimersByTimeAsync(3e3);
    expect(document.querySelector("video")).toBeNull();
    expect(img.hasAttribute("data-airo-video-patched")).toBe(false);
    expect(img.style.display).toBe("");
  });
  it("reconciles a video added after hydration (observer, direct node)", async function observerDirectNode() {
    document.body.innerHTML = '<div id="host"></div>';
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const host = document.getElementById("host");
    const video = document.createElement("video");
    video.src = `/airo-assets/videos/${SLOT}`;
    host.appendChild(video);
    await vi.advanceTimersByTimeAsync(0);
    expect(host.querySelector("video")).toBeNull();
    expect(host.querySelector("img").getAttribute("src")).toBe(
      `/airo-assets/images/${SLOT}`,
    );
  });
  it("reconciles a video inside an added subtree (observer, wrapper node)", async function observerSubtree() {
    document.body.innerHTML = '<div id="host"></div>';
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const host = document.getElementById("host");
    const wrapper = document.createElement("section");
    wrapper.innerHTML = `<video src="/airo-assets/videos/${SLOT}"></video>`;
    host.appendChild(wrapper);
    await vi.advanceTimersByTimeAsync(0);
    expect(wrapper.querySelector("video")).toBeNull();
    expect(wrapper.querySelector("img").getAttribute("src")).toBe(
      `/airo-assets/images/${SLOT}`,
    );
  });
  it("reveals a patched img whose video is already gone", async function orphanedPatchedImg() {
    document.body.innerHTML = `<div><img src="/airo-assets/images/${SLOT}" data-airo-video-patched="true" style="display: none;" /></div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    const img = document.querySelector("img");
    expect(img.hasAttribute("data-airo-video-patched")).toBe(false);
    expect(img.style.display).toBe("");
  });
  it("removes an injected video that lost its img sibling", async function injectedVideoWithoutSibling() {
    document.body.innerHTML = `<div><video data-airo-video="" data-slot="${SLOT}" src="/airo-assets/videos/${SLOT}"></video></div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "image" } });
    await runScript();
    expect(document.querySelector("video")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });
  it("leaves a patched pair untouched while the slot is still a video", async function videoSlotGuard() {
    document.body.innerHTML = `
      <div>
        <img src="/airo-assets/images/${SLOT}" data-airo-video-patched="true" style="display: none;" />
        <video data-airo-video="" data-slot="${SLOT}" src="/airo-assets/videos/${SLOT}"></video>
      </div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "video" } });
    await runScript();
    const img = document.querySelector("img");
    expect(document.querySelector("video")).not.toBeNull();
    expect(img.getAttribute("data-airo-video-patched")).toBe("true");
    expect(img.style.display).toBe("none");
  });
  it("still upgrades an img to video for a video slot", async function forwardStillWorks() {
    document.body.innerHTML = `<div><img src="/airo-assets/images/${SLOT}" /></div>`;
    stubManifestFetch({ [SLOT]: { mediaType: "video" } });
    await runScript();
    const video = document.querySelector("video");
    const img = document.querySelector("img");
    expect(video).not.toBeNull();
    expect(video.getAttribute("data-slot")).toBe(SLOT);
    expect(img.getAttribute("data-airo-video-patched")).toBe("true");
    expect(img.style.display).toBe("none");
  });
});
