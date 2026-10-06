import React, { useEffect, useRef, useState } from 'react'
import { heroImages } from '../services/assets';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const layouts = [
      { y: -240, scale: 0.72, rotate: -4 },
      { y: 150, scale: 0.82, rotate: 2 },
      { y: -125, scale: 1.0, rotate: 3 },
      { y: 215, scale: 0.65, rotate: -2 },
      { y: -195, scale: 0.88, rotate: -3 },
      { y: 105, scale: 0.95, rotate: 4 },
      { y: -70, scale: 0.70, rotate: -1 },
      { y: 185, scale: 0.78, rotate: 2 },
      { y: -160, scale: 0.92, rotate: -4 },
      { y: 125, scale: 0.72, rotate: 3 },
      { y: -105, scale: 0.84, rotate: 1 },
      { y: 235, scale: 0.66, rotate: -3 },
];

const HeroFlip = () => {
      // console.log(heroImages);

      const cardRef = useRef([]);
      const spotlightRef = useRef(null);
      const parRef = useRef(null);
      const lineRef = useRef(null);

      useGSAP(() => {
            const cards = cardRef.current.filter(Boolean);
            if (!cards.length) return;

            const lenis = new Lenis({
                  lerp: 0.08,
                  smoothWheel: true,
                  syncTouch: true,
                  wheelMultiplier: 1,
                  touchMultiplier: 1,
                  autoRaf: false,
            });

            const lenisUpdate = (time) => {
                  lenis.raf(time * 1000);
            };


            gsap.ticker.add(lenisUpdate);


            /*
               Prevent GSAP from adding its own
               lag smoothing on top of Lenis.
            */
            gsap.ticker.lagSmoothing(0);


            /*
              ScrollTrigger must update whenever
              Lenis scrolls.
            */
            lenis.on('scroll', ScrollTrigger.update);


            const cardGap = 40;

            //desi jugaar make the card as close as posibble 
            const startX = window.innerWidth * 0.01;
            const totalDist = heroImages.length * cardGap;

            const cycleDistance = totalDist * 2.5;
            const loops = 100;

            const st = ScrollTrigger.create({
                  trigger: spotlightRef.current,
                  start: "top top",
                  end: `+=${cycleDistance * loops}`,
                  pin: parRef.current,
                  scrub: true,
                  anticipatePin: 1,
            });

            //this function chnages and handle all animation with every ticker and scroll instance 
            //new way to play a progressive animation via gsap.ticker.add(update) later we will do this
            const update = () => {
                  const progress = (st.progress * loops) % 1;
                  const viewportWidth = window.innerWidth;


                  const lineX = progress * viewportWidth;
                  //console.log("progress:", progress, "viewportWidth:", viewportWidth, "lineX:", lineX);

                  gsap.set(lineRef.current, { x: lineX });

                  const trackProgress = progress * totalDist;


                  cards.forEach((card, idx) => {
                        const baseX = startX + idx * cardGap;

                        //then by desi jugaar i just slow down the speed of cards and make them look 
                        //as a illusion that they are activating and end according to line
                        const currentX = baseX - trackProgress * 0.5;

                        let distance = Math.abs(currentX - lineX);

                        const activeRange = 400;
                        //const cardHalfWidth = card.offsetWidth / 2;

                        let amount = 1 - Math.min(distance / activeRange, 1);
                        amount = gsap.parseEase("power3.out")(amount);

                        const layout = layouts[idx % layouts.length];
                        const minScale = 0.08;

                        const targetScale = minScale + (layout.scale - minScale) * amount;
                        const targetY = layout.y * amount;
                        const rotation = layout.rotate * amount;

                        gsap.set(card, {
                              x: currentX,
                              y: targetY,
                              scale: targetScale,
                              //opacity,
                              //rotation,
                              force3D: true
                        });

                  })
            };

            gsap.ticker.add(update);
            update();

            return () => {
                  gsap.ticker.remove(update);
                  gsap.ticker.remove(lenisUpdate);

                  lenis.off(
                        'scroll',
                        ScrollTrigger.update
                  );

                  lenis.destroy();

                  st.kill();
            }

      }, { scope: spotlightRef });

      return (
            <div className='hero relative' ref={parRef}>
                  <div className="absolute w-26 h-18 left-1/2 -translate-x-1/2 top-4">
                        <img className='w-[90%] h-[90%] object-cover' src="scroll.png" alt="scroll" />
                  </div>

                  <div className="stripe relative w-full h-screen overflow-hidden" ref={spotlightRef}>

                        <div className="spotlight absolute inset-0 pointer-events-none">
                              {heroImages.map((item, idx) => (
                                    <div key={item.id}
                                          ref={(el) => cardRef.current[idx] = el}
                                          className='card absolute top-1/2 -translate-y-1/2 
                                          w-77 h-50.5 origin-center overflow-hidden rounded-xs shadow-xs
                                          will-change-transform'
                                    >
                                          <img src={item.img} alt="item-image"
                                                loading='eager'
                                                decoding="async"
                                                className='w-full h-full object-cover overflow-hidden'
                                          />
                                    </div>
                              ))}
                        </div>

                        <div className='stripe-line absolute top-0 bottom-0 left-0 w-px z-200 pointer-events-none' ref={lineRef}>
                              <div className='
                                    absolute top-0 left-1/2 -translate-x-1/2
                                    w-0 h-0
                                    border-l-[6px] border-l-transparent
                                    border-r-[6px] border-r-transparent
                                    border-t-8 border-t-black'
                              />

                              <div className='absolute left-1/2 -translate-x-1/2 top-3.5 bottom-3.5 w-px bg-black' />

                              <div className='
                                    absolute bottom-0 left-1/2 -translate-x-1/2 
                                    w-0 h-0 border-l-[6px] border-l-transparent
                                    border-r-[6px] border-r-transparent
                                    border-b-8 border-b-black'
                              />
                        </div>

                        <div className='absolute w-full bottom-0 flex flex-col items-center justify-center left-4 px-4 py-1'>
                              <span className='text-xl italic'>Be patient images may take time to load</span>
                              <span className='text-xl italic'>I have used GSAP (SCROLLTRIGGER) + LENIS HERE</span>
                        </div>
                  </div>
            </div>
      )
}

export default HeroFlip