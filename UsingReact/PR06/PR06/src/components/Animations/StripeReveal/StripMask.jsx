import '../styles/stripeMask.css';
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  CONFIG,
  getTotalHeightVH,
  getStripeHeightPct,
  getStripeTopPct,
  setupLenisScroll,
  createStripMaskTimeline,
} from "../utils/stripeMask.js";

function StripMask({ config = CONFIG }) {
  const {
    images,
    stripeCount,
    scrollPerTransitionVH,
    staggerEach,
    stripeEase,
    scrub,
  } = config;

  const wrapperRef = useRef(null);
  const pinRef = useRef(null);

  // stripeRefs.current[transitionIndex] = array of stripe DOM nodes
  const stripeRefs = useRef([]);

  useEffect(() => {
    const cleanupLenis = setupLenisScroll();
    const transitions = images.length - 1; // number of "image behind image" reveals

    const ctx = gsap.context(() => {
      createStripMaskTimeline({
        wrapperEl: wrapperRef.current,
        pinEl: pinRef.current,
        stripeLayers: stripeRefs.current,
        transitions,
        scrollPerTransitionVH,
        staggerEach,
        stripeEase,
        scrub,
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
      cleanupLenis();
    };
  }, [images, stripeCount, scrollPerTransitionVH, staggerEach, stripeEase, scrub]);

  const totalHeightVH = getTotalHeightVH(images.length, scrollPerTransitionVH);

  return (
    <div
      ref={wrapperRef}
      className="stripmask-wrapper"
      style={{ height: `${totalHeightVH}vh` }}
    >
      <div ref={pinRef} className="stripmask-pin">
        <div className="stripmask-stage">
          {images.map((src, i) => {
            const isLast = i === images.length - 1;
            return (
              <div
                key={src + i}
                className="stripmask-layer"
                style={{
                  // first image sits on top (z highest), last image is the
                  // plain base layer underneath everything
                  zIndex: images.length - i,
                }}
              >
                {isLast ? (
                  <div
                    className="stripmask-base-image"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ) : (
                  <StripeLayer
                    src={src}
                    count={stripeCount}
                    onMount={(els) => (stripeRefs.current[i] = els)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders one image sliced into `count` thin horizontal stripes stacked
 * top-to-bottom. Each stripe shows the same point of the image it would
 * show if the image weren't sliced at all (slicing technique: each
 * stripe is `overflow:hidden` and contains an oversized inner copy of
 * the full image, shifted up so only its own slice is visible).
 *
 * GSAP (in stripeMask.js) animates each stripe's clip-path from fully
 * visible (inset(0% 0% 0% 0%)) to fully clipped from the bottom edge
 * upward (inset(0% 0% 100% 0%)) — so each stripe "opens" upward,
 * revealing whatever layer sits behind it. Running the scroll in
 * reverse reverses the same tween, so the stripe closes back up and
 * the image reappears.
 */
function StripeLayer({ src, count, onMount }) {
  const els = useRef([]);

  useEffect(() => {
    onMount(els.current);
  }, [onMount]);

  const stripeHeightPct = getStripeHeightPct(count);

  return (
    <div className="stripmask-stripe-group">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          ref={(el) => (els.current[idx] = el)}
          className="stripmask-stripe"
          style={{
            top: `${getStripeTopPct(idx, count)}%`,
            height: `${stripeHeightPct + 0.2}%`,
            //have pass some extra 0.2 % value to hide the slight gap
          }}
        >
          <div
            className="stripmask-stripe-image"
            style={{
              top: `${-idx * 100}%`,
              height: `${count * 100}%`,
              backgroundImage: `url(${src})`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default StripMask;