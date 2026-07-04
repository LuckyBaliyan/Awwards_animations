import React, { useRef, useState } from 'react'
import './styles/hero.css'
import { assets } from '../utils/data'
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(useGSAP, CustomEase);
CustomEase.create("hop1","0.8, 0, 0.2, 1");

const Hero = () => {

 const assetsRef = useRef([]);
 const headingRef = useRef(null);
 const [counter, setCounter] = useState();

const cardPositions = [
  {x:"20vw", y:"-28vh"},
  {x:"-23vw", y:"-22vh"},
  {x:"-25vw", y:"25vh"},
  {x:"40vw", y:"28vh"},
  {x:"-45vw", y:"38vh"},
  {x:"36vw", y:"-10vh"},
  {x:"-45vw", y:"-39vh"},
  {x:"20vw", y:"35vh"},
];

let shuffledIndices = [];

//gsap suffle function always gives a unique array value as index and pop() it and reshuffle the array
//think it like a card game shuffle evry time after removing a card

const getUniqueRandomIndex = () => {
    if (shuffledIndices.length === 0) {
        shuffledIndices = gsap.utils.shuffle(
          Array.from({ length: cardPositions.length }, (_, i) => i)
        );
    }
    return shuffledIndices.pop();
};

const getRandomOffset = () => {
    const i = getUniqueRandomIndex();
    return cardPositions[i];
};

function handleResize(){
    console.log("resize");
}

useGSAP(() => {
    const handleResize = () => {
        window.location.reload();
    };

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, []);

useGSAP(()=>{
    const cards = gsap.utils.toArray(assetsRef.current);
    const tl = gsap.timeline({delay: 0.25});
    const frameImage = cards[0].querySelector("img");

    const frame = {value: 0};

    cards.forEach((card, i)=>{
        if(i > 0){
            gsap.set(card,{display: "none", opacity: 0});
        }
        else{
            gsap.set(card,{clipPath:"polygon(0 0, 100% 0, 100% 0%, 0 0%)",scale:0.85});
        }
    })

    tl.to(cards[0],{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ease: "hop1",
        duration:.8,
        delay:0.5,
    })
    .to(frame,{
        value:assets.length,
        duration: 0.8,
        ease:"none",
        onUpdate:()=>{
            let i = Math.min(Math.floor(frame.value), assets.length - 1);
            frameImage.src = assets[i];
        },
        onComplete:()=>{
            frameImage.src = assets[0];
        }
    })
    .to(cards,{
        display:"block",
        opacity:1,
        zIndex: 100,
        stagger:0.09,
    })
    .to(cards[0],{
        scale:1.05,
        ease:"hop1",
    });

    cards.forEach((card, i)=>{
        const pos = getRandomOffset();

        tl.to(card,{
            ...pos,
            ease:"hop1",
            duration: 1.2
        },"<");
    });
    
    tl.to(headingRef.current,{
        opacity:1,
    });

 },[]);

  return (
    <div className="spotlight">
        <div className="spotlight-placeholder">
            <h2 ref={headingRef}>
                Show Case
            </h2>
        </div>

        <div className="spotlight-overlay">
            {
                assets.map((src, i)=>(
                    <div ref={(el)=>assetsRef.current[i] = el} className='img-wrapper'>
                        <img src={src} alt="show-case-img" />
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Hero