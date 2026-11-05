import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel";
const mocks = vi.hoisted(() => ({
  state: {
    listeners: {},
    autoplay: null,
    api: null,
  },
}));
vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), mocks.state.api],
}));
function emit(event) {
  const listeners = mocks.state.listeners[event] ?? [];
  listeners.forEach((fn) => fn());
}
function dispatchEditMode(active) {
  window.__airoEditModeActive = active;
  act(() => {
    window.dispatchEvent(
      new CustomEvent("airo:edit-mode-change", {
        detail: {
          active,
        },
      }),
    );
  });
}
function dispatchCarouselSlotEdit(active, carouselRoot) {
  window.__airoCarouselSlotEditActive = active;
  window.__airoCarouselSlotEditRoot = active ? (carouselRoot ?? null) : null;
  act(() => {
    window.dispatchEvent(
      new CustomEvent("airo:carousel-slot-edit", {
        detail: {
          active,
        },
      }),
    );
  });
}
function dispatchCarouselToolbarPause(active, carouselRoot) {
  window.__airoCarouselToolbarPauseRoot = active
    ? (carouselRoot ?? null)
    : null;
  act(() => {
    window.dispatchEvent(
      new CustomEvent("airo:carousel-toolbar-pause", {
        detail: {
          active,
        },
      }),
    );
  });
}
function renderCarouselWithNav() {
  return render(
    /* @__PURE__ */ <Carousel>
      <CarouselContent>
        <CarouselItem>slide 1</CarouselItem>
        <CarouselItem>slide 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>,
  );
}
function renderCarousel() {
  return render(
    /* @__PURE__ */ <Carousel>
      <CarouselContent>
        <CarouselItem>slide 1</CarouselItem>
        <CarouselItem>slide 2</CarouselItem>
      </CarouselContent>
    </Carousel>,
  );
}
describe("Carousel \u2014 edit-mode pause + nav overlay", () => {
  beforeEach(() => {
    delete window.__airoEditModeActive;
    delete window.__airoCarouselSlotEditActive;
    delete window.__airoCarouselSlotEditRoot;
    delete window.__airoCarouselToolbarPauseRoot;
    mocks.state.listeners = {};
    mocks.state.autoplay = {
      stop: vi.fn(),
      play: vi.fn(),
    };
    mocks.state.api = {
      canScrollPrev: () => true,
      canScrollNext: () => true,
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      selectedScrollSnap: () => 1,
      plugins: () => ({
        autoplay: mocks.state.autoplay,
      }),
      on: (event, fn) => {
        const arr = mocks.state.listeners[event] ?? [];
        arr.push(fn);
        mocks.state.listeners[event] = arr;
      },
      off: (event, fn) => {
        const arr = mocks.state.listeners[event] ?? [];
        mocks.state.listeners[event] = arr.filter((l) => l !== fn);
      },
    };
  });
  afterEach(() => {
    delete window.__airoEditModeActive;
    delete window.__airoCarouselSlotEditActive;
    delete window.__airoCarouselSlotEditRoot;
    delete window.__airoCarouselToolbarPauseRoot;
  });
  it("keeps autoplay running when edit mode is enabled", () => {
    renderCarousel();
    mocks.state.autoplay?.play.mockClear();
    mocks.state.autoplay?.stop.mockClear();
    dispatchEditMode(true);
    expect(mocks.state.autoplay?.stop).not.toHaveBeenCalled();
    expect(mocks.state.autoplay?.play).not.toHaveBeenCalled();
  });
  it("pauses autoplay when carousel slot edit is active", () => {
    renderCarousel();
    mocks.state.autoplay?.play.mockClear();
    mocks.state.autoplay?.stop.mockClear();
    dispatchCarouselSlotEdit(true);
    expect(mocks.state.autoplay?.stop).toHaveBeenCalled();
    expect(mocks.state.autoplay?.play).not.toHaveBeenCalled();
  });
  it("pauses autoplay when the Replace toolbar is open on the target carousel", () => {
    const { container } = renderCarousel();
    const carouselRoot = container.querySelector(
      '[aria-roledescription="carousel"]',
    );
    mocks.state.autoplay?.play.mockClear();
    mocks.state.autoplay?.stop.mockClear();
    dispatchCarouselToolbarPause(true, carouselRoot);
    expect(mocks.state.autoplay?.stop).toHaveBeenCalled();
    expect(mocks.state.autoplay?.play).not.toHaveBeenCalled();
  });
  it("resumes autoplay when the Replace toolbar closes on the target carousel", () => {
    const { container } = renderCarousel();
    const carouselRoot = container.querySelector(
      '[aria-roledescription="carousel"]',
    );
    dispatchCarouselToolbarPause(true, carouselRoot);
    mocks.state.autoplay?.stop.mockClear();
    mocks.state.autoplay?.play.mockClear();
    dispatchCarouselToolbarPause(false);
    expect(mocks.state.autoplay?.play).toHaveBeenCalled();
  });
  it("resumes autoplay when carousel slot edit ends", () => {
    renderCarousel();
    dispatchCarouselSlotEdit(true);
    mocks.state.autoplay?.stop.mockClear();
    mocks.state.autoplay?.play.mockClear();
    dispatchCarouselSlotEdit(false);
    expect(mocks.state.autoplay?.play).toHaveBeenCalled();
  });
  it("honors the initial carousel-slot-edit flag set before mount", () => {
    window.__airoCarouselSlotEditActive = true;
    renderCarousel();
    expect(mocks.state.autoplay?.stop).toHaveBeenCalled();
  });
  it("defers re-stop via microtask when autoplay:play fires during carousel slot edit", async () => {
    renderCarousel();
    dispatchCarouselSlotEdit(true);
    mocks.state.autoplay?.stop.mockClear();
    emit("autoplay:play");
    expect(mocks.state.autoplay?.stop).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(mocks.state.autoplay?.stop).toHaveBeenCalled();
  });
  it("defers re-stop via microtask when autoplay:play fires during toolbar pause", async () => {
    const { container } = renderCarousel();
    const carouselRoot = container.querySelector(
      '[aria-roledescription="carousel"]',
    );
    dispatchCarouselToolbarPause(true, carouselRoot);
    mocks.state.autoplay?.stop.mockClear();
    emit("autoplay:play");
    expect(mocks.state.autoplay?.stop).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(mocks.state.autoplay?.stop).toHaveBeenCalled();
  });
  it("does not re-stop on autoplay:play when edit mode is off", async () => {
    renderCarousel();
    mocks.state.autoplay?.stop.mockClear();
    emit("autoplay:play");
    await Promise.resolve();
    expect(mocks.state.autoplay?.stop).not.toHaveBeenCalled();
  });
  it("hides native carousel nav buttons during carousel slot edit on the target carousel", () => {
    const { queryByRole, container } = renderCarouselWithNav();
    const carouselRoot = container.querySelector(
      '[aria-roledescription="carousel"]',
    );
    expect(
      queryByRole("button", {
        name: "Previous slide",
      }),
    ).not.toBeNull();
    expect(
      queryByRole("button", {
        name: "Next slide",
      }),
    ).not.toBeNull();
    dispatchCarouselSlotEdit(true, carouselRoot);
    expect(
      queryByRole("button", {
        name: "Previous slide",
      }),
    ).toBeNull();
    expect(
      queryByRole("button", {
        name: "Next slide",
      }),
    ).toBeNull();
    dispatchCarouselSlotEdit(false);
    expect(
      queryByRole("button", {
        name: "Previous slide",
      }),
    ).not.toBeNull();
    expect(
      queryByRole("button", {
        name: "Next slide",
      }),
    ).not.toBeNull();
  });
  it("responds to carousel slot nav events for the target carousel", () => {
    const { container } = renderCarousel();
    const carouselRoot = container.querySelector(
      '[aria-roledescription="carousel"]',
    );
    dispatchCarouselSlotEdit(true, carouselRoot);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("airo:carousel-slot-nav", {
          detail: {
            direction: "next",
          },
        }),
      );
    });
    expect(mocks.state.api?.scrollNext).toHaveBeenCalled();
  });
  it("emits carousel slot select when slide changes during slot edit", () => {
    const handler = vi.fn();
    window.addEventListener("airo:carousel-slot-select", handler);
    try {
      const { container } = renderCarousel();
      const carouselRoot = container.querySelector(
        '[aria-roledescription="carousel"]',
      );
      dispatchCarouselSlotEdit(true, carouselRoot);
      emit("select");
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            carouselRoot,
            selectedIndex: 1,
          }),
        }),
      );
    } finally {
      window.removeEventListener("airo:carousel-slot-select", handler);
    }
  });
  it("is a no-op when the carousel has no autoplay plugin", () => {
    mocks.state.autoplay = null;
    mocks.state.api = {
      ...mocks.state.api,
      plugins: () => ({}),
    };
    renderCarousel();
    expect(() => dispatchEditMode(true)).not.toThrow();
    expect(() => dispatchEditMode(false)).not.toThrow();
  });
});
