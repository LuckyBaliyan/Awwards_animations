import React,{Children, cloneElement, isValidElement, useRef, useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// % values of how much we render an image at a time
const DEF_PX_STEPS = [2,5,6,8,100];

const PixelWrapper = ({
    children, 
    pxSteps = DEF_PX_STEPS, 
    triggerStart = `top+=20% bottom`,
    speed = 80,
    initialDelay = 300,
    className = '',
    style={},
  }) => {

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  //store animating values in ref instead of useState because they chnages according to frames
  const stateRef = useRef({pxIdx:0, imageRatio: 1, img: null});

  useEffect(()=>{
    const container = containerRef.current;
    const canvas = canvasRef.current;
    //get 2d drawing context without it drawing is't possible
    const cntx = canvas.getContext('2d');
    //get cloned image fake cloned overlay image
    const hiddenImage = container.querySelector("img[data-pixel-src]");
    const state = stateRef.current;

    if(!hiddenImage)return;

    //create a new canvas Img()
    const img = new Image();
    //without it browser blocks external images
    img.crossOrigin = 'anonymous';
    img.src = hiddenImage.getAttribute('data-pixel-src') || hiddenImage.src;
    state.img = img;
    
    const render = ()=>{
       const {offsetWidth:cw, offsetHeight: ch} = container;
       canvas.width = cw;
       canvas.height = ch;

       //make it a bit large to render to hide white borders
       const w = cw * 1.05;
       const h = ch * 1.05;

       let newWidth = w, newHeight = h, newX = 0, newY = 0;

       if(w / h > state.imageRatio){
          newHeight =Math.round( w / state.imageRatio);
       }
       else{
          newWidth = Math.round( h * state.imageRatio);
          newX = (w - newWidth) / 2;
       }


       const size = pxSteps[state.pxIdx]*.01;
       cntx.imageSmoothingEnabled = size === 1;
       cntx.clearRect(0,0,cw,ch);
       cntx.drawImage(img, 0, 0, w*size, h*size);
       cntx.drawImage(canvas, 0, 0, w*size, h*size, newX, newY, newWidth, newHeight);
    }

    const animatePixel = ()=>{
        if(state.pxIdx < pxSteps.length){
           setTimeout(()=>{
             render();
             state.pxIdx++;
             animatePixel();
           },state.pxIdx === 0 ? initialDelay : speed); 
           //give duration according to start time or b/w time
        }
    }

    img.onload = ()=>{
        //get ratio from image and set to state for later use 
       state.imageRatio = img.width / img.height;
       //hit render on first time
       render();


       //re calculate and reRender on window shrink
       window.addEventListener('resize', render);

       ScrollTrigger.create({
        trigger:container,
        start:triggerStart,
        onEnter:animatePixel,
        once:true,
       })

       ScrollTrigger.create({
        trigger:container,
        start:"top bottom",
        onEnter:()=> gsap.set(container,{opacity:1}),
        once:true,
       })
    }

     //clean-up code
    return ()=>{
       window.removeEventListener('resize', render);
       ScrollTrigger.getAll().forEach((t)=>t.kill());
    }

  },[pxSteps, triggerStart, initialDelay, speed]);

  const wrapperChild = Children.map(children, (child)=>{
    if(isValidElement(child) && (child.type === 'img' || child.type?.displayName === 'Image' ||
        child.type.name === 'Image'
    )){
        return cloneElement(child,{
            //dynamically add an attribute to later select the cloned image from it
            'data-pixel-src':child.props.src,
            style:{...child.props.style, opacity:1, position:'absolute', pointerEvents:'none'}
        });
    }
  });

  return (
    <div ref={containerRef} className={`relative opacity-0 overflow-hidden ${className}`} style={style}>
        {wrapperChild}
        <canvas ref={canvasRef} className='absolute size-full inset-0'></canvas>
    </div>
  )
}

export default PixelWrapper;