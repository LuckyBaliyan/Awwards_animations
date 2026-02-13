import { useEffect, useRef } from "react";
import {useGSAP} from '@gsap/react';
import gsap from "gsap";

const App = () => {
    const containerRef = useRef(null);

    useGSAP(()=>{
     const cards = document.querySelectorAll('.card');

      gsap.from(cards, {
          opacity:0,
          duration: 1,
          delay:1,
          ease: "power3.out",
          stagger: 0.086,
      });

    },[])
    
  return (
    <>
     <main>
           <section>
               <div class="card-container" ref={containerRef}>
                   <div style={{"--angle": `${-24}deg`,"--offset":`${-50}%`}} data-rot='1' class="card card1">
                       <img src="https://i.pinimg.com/736x/d9/5d/fd/d95dfd8b9be8e711f562bd7567713625.jpg" alt="" />
                   </div>
                   <div style={{"--angle": `${-16}deg`,"--offset":`${-40}%`}} class="card card2">
                       <img src="https://i.pinimg.com/736x/cc/de/b4/ccdeb4381c896d7543ee3bd40ef00eba.jpg" alt="" />
                   </div>
                   <div style={{"--angle": `${-8}deg`,"--offset":`${-30}%`}}  data-rot='1.5' class="card card3">
                       <img src="https://i.pinimg.com/736x/f6/55/b6/f655b6d9ea17f6142918f1757376c328.jpg" alt=""/>
                   </div>
                   <div style={{"--angle": `${0}deg`,"--offset":`${0}%`,"--z":5}} data-rot='2' class="card card4">
                         <img src="https://i.pinimg.com/736x/e2/59/c4/e259c4fec93ab9aa44b240bb04d3a9c3.jpg" alt=""/>
                   </div>
                   <div style={{"--angle": `${8}deg`,"--offset":`${30}%`,"--z":4}} data-rot='2.5' class="card card5">
                         <img src="https://i.pinimg.com/736x/61/ac/9e/61ac9e31dd12574c07c56cba3cc6dd16.jpg" alt=""/>
                   </div>
                   <div style={{"--angle": `${16}deg`,"--offset":`${40}%`,"--z":3}} data-rot='3' class="card card6">
                         <img src="https://i.pinimg.com/736x/3e/96/1a/3e961a77033770df38b2de31fce8e282.jpg" alt=""/>
                   </div>
                   <div style={{"--angle": `${24}deg`,"--offset":`${50}%`,"--z":2}} data-rot='3.5' class="card card7">
                        <img src="https://i.pinimg.com/1200x/bb/8a/71/bb8a713c5084be8365449633bdcd8499.jpg" alt=""/>
                   </div>
               </div>
               <div className='heading'>
                   <h2>
                       <span>Kaino</span> <br /> Praxis
                   </h2>
               </div>
           </section>
       </main>
    </>
  )
}

export default App;