import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIG
 * ---------------------------------------------------------------
 * images               - ordered array of image URLs. images[0] is what
 *                         the user sees first, the last one is what's
 *                         left showing once the pin releases.
 * stripeCount          - number of horizontal stripes per transition (~100) 
 *                        in my case 50(perfect).
 * scrollPerTransitionVH - how much scroll (in vh) is spent revealing one
 *                         image behind the previous one. Bigger = slower.
 * staggerEach          - delay between each stripe's animation start.
 * stripeEase           - easing used for each stripe's clip animation.
 * scrub                - scrub value passed to ScrollTrigger (true/number).
 */

export const CONFIG = {
  images: [
    /*"https://i.pinimg.com/736x/d4/de/aa/d4deaa8eed3eb661cb9344cbf3b29d3d.jpg",
    "https://i.pinimg.com/736x/89/06/98/8906989059c3d333ed7a612e0c45b555.jpg",
    "https://i.pinimg.com/736x/88/6f/be/886fbef0327cfa8febdab8c1f125d53a.jpg",
    "https://i.pinimg.com/1200x/40/04/72/400472ccddf20adb0c71c93511e2df8e.jpg",*/
    "/6.webp",
    "/8.webp",
    "/4.webp",
    "/9.webp",
    "/5.webp"
  ],
  stripeCount: 50,
  scrollPerTransitionVH: 120,
  staggerEach: 0.012,
  stripeEase: "power2.inOut",
  scrub: 1,
};

/** Total scrollable height (vh) for the whole pinned sequence. */
export function getTotalHeightVH(imageCount, scrollPerTransitionVH) {
  return (imageCount - 1) * scrollPerTransitionVH + 100;
}

/**
 * Height (%) of a single stripe within its layer. A small overlap
 * (+0.1%) is added so adjacent stripes don't leave a hairline gap
 * from sub-pixel rounding.
 */
export function getStripeHeightPct(stripeCount) {
  return 100 / stripeCount;
}

/** Top offset (%) of a given stripe within its layer (no overlap added). */
export function getStripeTopPct(index, stripeCount) {
  return index * (100 / stripeCount);
}

/**
 * Boots a Lenis smooth-scroll instance wired into GSAP's ticker and
 * kept in sync with ScrollTrigger. Returns a cleanup function.
 */
export function setupLenisScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
  });

  const onTick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);
  lenis.on("scroll", ScrollTrigger.update);

  return function cleanupLenis() {
    gsap.ticker.remove(onTick);
    lenis.destroy();
  };
}

/**
 * Builds the master pinned ScrollTrigger timeline that drives every
 * stripe-layer transition in sequence. `stripeLayers` is an array where
 * stripeLayers[i] is the list of stripe DOM nodes for transition i.
 */
export function createStripMaskTimeline({
  wrapperEl,
  pinEl,
  stripeLayers,
  transitions,
  scrollPerTransitionVH,
  staggerEach,
  stripeEase,
  scrub,
}) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapperEl,
      start: "top top",
      end: () => `+=${transitions * scrollPerTransitionVH}%`,
      scrub,
      pin: pinEl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  for (let i = 0; i < transitions; i++) {
    const stripes = stripeLayers[i];
    if (!stripes || !stripes.length) continue;

    // A lightweight proxy object per stripe lets us tween a single
    // number and translate it into a clip-path on every update,
    // instead of fighting GSAP/CSS over clip-path interpolation.
    const proxies = stripes.map(() => ({ v: 0 }));

    tl.to(
      proxies,
      {
        v: 100,
        ease: stripeEase,
        stagger: { each: staggerEach, from: "center" },
        onUpdate: function () {
          this.targets().forEach((p, idx) => {
            const el = stripes[idx];
            if (el) el.style.clipPath = `inset(0% 0% ${p.v}% 0%)`;
          });
        },
      },
      i // each transition gets its own timeline position (sequential)
    );
  }

  return tl;
}