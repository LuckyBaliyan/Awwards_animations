import React,{use, useRef} from 'react'
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react'

const Hero = () => {

  gsap.registerPlugin(SplitText,CustomEase);

  CustomEase.create("hop","0.85, 0, 0.15, 1");

  const counterRef = useRef(null);
  const counter = {value:0};

  const heroImagesRef = useRef(null);
  //const imagesRef = useRef([]); will not be using due to anbiguty in .img and .hero-img 


  const headingRef = useRef(null);
  const overlaytextRef = useRef(null);

  const overlayRef = useRef(null);

  useGSAP(()=>{
    let splitText = SplitText.create(headingRef.current,{
        type:"words",
        mask:"words",
        wordsClass:"word",
    });
   
    const counterTl = gsap.timeline({delay:0.5});
    const overlayTextTl = gsap.timeline({delay:0.75});
    const revealTl = gsap.timeline({delay:0.5});

    counterTl.to(counter,{
        value:100,
        duration:5,
        ease:"power2.out",
        onUpdate:()=>counterRef.current.textContent = `${Math.floor(counter.value)}%`,
    });

    overlayTextTl.to(overlaytextRef.current,{
      y:"0",
      duration:0.75,
      ease:"hop",
    })
    .to(overlaytextRef.current,{
      y:"-2rem",
      duration:0.75,
      ease:"hop",
      delay:0.75,
    })
    .to(overlaytextRef.current,{
      y:"-4rem",
      duration:0.75,
      ease:"hop",
      delay:0.75,
    })
    .to(overlaytextRef.current,{
      y:"-6rem",
      duration:0.75,
      ease:"hop",
      delay:1,
    });

    revealTl.to('.img',{
      y:0,
      opacity:1,
      ease:"hop",
      stagger:0.05,
      duration:1
    })
    .to(heroImagesRef.current,{
      gap:"0.75vw",
      duration:1,
      ease:"hop",
      delay:0.5,
    })
    .to('.img',{
      scale:1,
      duration:1,
      ease:"hop",
    },"<")
    .to('.img:not(.hero-img)',{
      clipPath:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration:1,
      stagger:0.1,
      ease:"hop",
    })
    .to('.hero-img',{
      scale:2,
      duration:1,
      ease:"hop",
    })
    .to(overlayRef.current,{
      clipPath:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration:1,
      ease:"hop",
    })
    .to(".hero-header h1 .word",{
      y:"0",
      duration:0.75,
      ease:'power3.out',
      stagger:0.1
    },
  "-=0.5");
  },[]);


  return (
    <section className='hero'>
          <div ref={overlayRef} className="hero-overlay">
            <div className="counter">
                <h1 ref={counterRef}>0%</h1>
            </div>

            <div className="overlay-text-container">
                <div className="overlay-text" ref={overlaytextRef}>
                    <p>Structure</p>
                    <p>Design Identity</p>
                    <p>Welcome</p>
                </div>
            </div>
          </div>

          <div ref={heroImagesRef} className="hero-images">
            <div className='img'><img src="6.png" alt=""  /></div>
            <div className='img'><img src="6.png" alt="" /></div>
            <div className='img hero-img'><img src="6.png" alt="" /></div>
            <div className='img'><img src="6.png" alt="" /></div>
            <div className='img'><img src="6.png" alt="" /></div>
          </div>

          <div className="hero-header">
            <h1 ref={headingRef}>
                Elera Vandenberg
            </h1>
          </div>
    </section>
  )
}

export default Hero