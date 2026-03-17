import React, { useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router";
import "./style.scss";

gsap.registerPlugin(DrawSVGPlugin);

const Wrapper = ({ children }) => {
  const location = useLocation();

  const pathRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Start from FULLY COVERED
    gsap.set(pathRef.current, {
      drawSVG: "-100%",
      strokeWidth: 250,
    });

    // REVEAL animation
    tl.to(pathRef.current, {
      drawSVG: "0%",
      strokeWidth: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });

    return () => tl.kill();
  }, [location]);

  return (
    <div>
      <div className="mask">
        <svg
          width="180%"
          height="180%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full scale-130 h-full"
          preserveAspectRatio="xMidYMid slice"
        >
        <path
            ref={pathRef}
            d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
            stroke="#82A0FF"
            //stroke="hsl(107, 20%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {children}
    </div>
  );
};

export default Wrapper;