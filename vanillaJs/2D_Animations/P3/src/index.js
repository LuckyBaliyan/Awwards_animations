import './index.css';
import gsap, { selector } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop1","0.8, 0, 0.2, 1");
CustomEase.create("hop2","0.9, 0, 0.1, 1");

document.querySelector("#root").innerHTML = `
   <main>
        <div class="preloader">

          <div class="img-wrapper"><img src="assets/1.webp" alt="preloader-img"></div>
          <div class="img-wrapper"><img src="assets/2.webp" alt="preloader-img"></div>
          <div class="img-wrapper"><img src="assets/3.webp" alt="preloader-img"></div>
          <div class="img-wrapper"><img src="assets/4.webp" alt="preloader-img"></div>
          <div class="img-wrapper"><img src="assets/6.webp" alt="preloader-img"></div>
  
          <div class="preloader-intro">
            <h4>Unbound</h4>
            <div class="preloader-counter">
              <p>000</p>
            </div>
          </div>

        </div>

        <nav>

          <div class="nav-logo">
            <a href="#">Unbound</a>
          </div>

          <div class="nav-links">
            <a href="#">Index</a>
            <a href="#">Collections</a>
            <a href="#">Material</a>
            <a href="#">Process</a>
            <a href="#">Info</a>
          </div>

        </nav>
        
        <div class="hero">
          <div class="hero-header">
            <h1>Unbound</h1>
          </div>

          <div class="hero-footer">
            <p>Performance</p>
            <p>Craftmanship</p>
            <p>Experience</p>
          </div>

        </div>
      </main>
`;

const split = (selector, type, className, mask = true)=>{
  return SplitText.create(selector,{
    type:type,
    [`${type}Class`]: className,
    ...(mask && {mask:type})
  });
}


const preLoaderHeaderSplit = split(".preloader-intro h4","chars","char");
const navSplit = split("nav a","words","word");
const heroSplit = split(".hero-header h1","chars","char", false);
const footerSplit = split(".hero-footer p","words","word");

const preloadRotationOffsets = [7.5, -2.5, -10, 12.5, -5, 5];

gsap.set(".img-wrapper",{
  rotate:(i)=>preloadRotationOffsets[i],
});

const tl = gsap.timeline({delay: 0.5});

tl.to(".img-wrapper",{
  scale: 1,
  clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration:1,
  ease:"hop1",
  stagger:0.2,
})

tl.to(".preloader-intro h4 .char",{
  y: "0%",
  duration: 1,
  ease:"hop2",
  stagger:{each:0.125, from:"random"}
},"0.35",
)

tl.to(".preloader-counter p",{
  y: "0%",
  duration:1,
  ease:"hop1",
  onStart:()=>{
    const counterEl = document.querySelector(".preloader-intro p");
    const counter = {value: 0};

    gsap.to(counter,{
      value: 100,
      duration: 2,
      delay: 0.5,
      ease:"power2.inOut",

      onUpdate: ()=>{
        counterEl.innerHTML = 
        String(Math.round(counter.value)).
        padStart(3,"0");
      },

    });
  },
},
"<"
);

tl.to(".preloader-intro p",{
  y:"-100%",
  duration:0.75,
  ease:"hop2",
},
3.25
);

tl.to(".preloader-intro h4 .char",{
  y:"-100%",
  duration:0.75,
  ease:"hop2",
  stagger:{each:0.125, from:"random"},
},
3.25
);

tl.to(".img-wrapper",{
  scale:0,
  clipPath:"polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
  ease:"hop2",
  duration:1,
  stagger:-0.075,
},
3.5
);

tl.to(".preloader",{
  clipPath:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration:1,
  ease:"hop2",
},
4.35
);

tl.to(".hero-header h1 .char",{
  y:"0%",
  ease:"hop1",
  duration:1,
  stagger:{each:0.075, from:"random"}
},
4.65
);

tl.to("nav a .word",{
  y:"0%",
  ease:"hop1",
  duration:1,
  stagger:0.075,
}, 4.75
);

tl.to(".hero-footer p .word",{
  y:"0%",
  ease:"hop1",
  duration:1,
  stagger:0.075,
}, 4.75
);





