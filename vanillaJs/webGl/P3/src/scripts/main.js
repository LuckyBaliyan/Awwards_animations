import { slides } from "./data";
import { vertexShader, fragmentShader } from "./shaders";

import gsap from "gsap/all";
import { SplitText } from "gsap/SplitText";

import * as three from "three";

gsap.registerPlugin(SplitText);

let currentIndex = 0;
let isTransitioning = false;
let rippleTween = null;

const slider = document.querySelector(".slider");



function splitTitle(container) {
  const heading = container.querySelector(".slide-title h1");

  if (!heading) return null;

  return SplitText.create(heading, {
    type: "words chars",
    mask: "chars",
    charsClass: "char",
    wordsClass: "word",
  });
}

function splitLines(container) {
  const paras =
    container.querySelectorAll(".slide-description p");

  const allLines = [];

  paras.forEach((p) => {
    const split = SplitText.create(p, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });

    allLines.push(...split.lines);
  });

  return allLines;
}


function buildSlideElement(slide) {
  const el = document.createElement("div");

  el.className = "slide-content";
  el.style.opacity = "0";

  el.innerHTML = `
    <div class="slide-title">
      <h1>${slide.title}</h1>
    </div>

    <div class="slide-description">
      <p>${slide.description}</p>
    </div>
  `;

  return el;
}



function animateTextOut(container) {
  const titleSplit = splitTitle(container);
  const lines = splitLines(container);

  const tl = gsap.timeline();

  if (titleSplit) {
    tl.to(titleSplit.chars, {
      y: "-100%",
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.inOut",
    });
  }

  tl.to(
    lines,
    {
      y: "-100%",
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.inOut",
    },
    0.1
  );

  return tl;
}



function animateTextIn(container) {
  const titleSplit = splitTitle(container);
  const lines = splitLines(container);

  const chars = titleSplit ? titleSplit.chars : [];

  gsap.set([...chars, ...lines], {
    y: "100%",
  });

  gsap.set(container, {
    opacity: 1,
  });

  return gsap
    .timeline()
    .to(chars, {
      y: "0%",
      duration: 0.5,
      stagger: 0.02,
      ease: "power2.out",
    })
    .to(
      lines,
      {
        y: "0%",
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
      },
      0.1
    );
}


const scene = new three.Scene();

const camera = new three.OrthographicCamera(
  -1,
  1,
  1,
  -1,
  0.01,
  10
);

camera.position.z = 1;

const renderer = new three.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setClearColor(0x000000, 0);

slider.prepend(renderer.domElement);



const textureLoader = new three.TextureLoader();

const textures = [];

for (const slide of slides) {
  const texture = await new Promise((resolve) =>
    textureLoader.load(slide.imgUrl, resolve)
  );

  texture.minFilter = three.LinearFilter;
  texture.magFilter = three.LinearFilter;

  texture.wrapS =
    three.ClampToEdgeWrapping;

  texture.wrapT =
    three.ClampToEdgeWrapping;

  texture.userData = {
    width: texture.image.width,
    height: texture.image.height,
  };

  textures.push(texture);
}


const rippleConfig = {
  waveFreq: 40.0,
  wavePow: 0.02,
  waveWidth: 0.6,
  falloff: 6.0,
  boostStrength: 0.5,

  duration: 3.0,
  endValue: 2.0,
  ease: "power3.out",
};


const firstTexture = textures[0];

const uniforms = {
  uTexCurrent: {
    value: firstTexture,
  },

  uTexNext: {
    value: firstTexture,
  },

  uProgress: {
    value: 0,
  },

  uResolution: {
    value: new three.Vector2(
      window.innerWidth,
      window.innerHeight
    ),
  },

  uImageRes: {
    value: new three.Vector2(
      firstTexture.userData.width,
      firstTexture.userData.height
    ),
  },

  uWaveFreq: {
    value: rippleConfig.waveFreq,
  },

  uWavePow: {
    value: rippleConfig.wavePow,
  },

  uWaveWidth: {
    value: rippleConfig.waveWidth,
  },

  uFalloff: {
    value: rippleConfig.falloff,
  },

  uBoostStrength: {
    value: rippleConfig.boostStrength,
  },

  uMobile: {
    value:
      window.innerWidth <= 1000
        ? 1.0
        : 0.0,
  },
};

const material = new three.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
});

const plane = new three.Mesh(
  new three.PlaneGeometry(1, 1),
  material
);

scene.add(plane);



function resizeHandler() {
  const width = slider.clientWidth;
  const height = slider.clientHeight;

  renderer.setSize(width, height);

  uniforms.uResolution.value.set(
    width,
    height
  );

  uniforms.uMobile.value =
    window.innerWidth <= 1000
      ? 1.0
      : 0.0;

  camera.updateProjectionMatrix();
}

window.addEventListener(
  "resize",
  resizeHandler
);

resizeHandler();


const initialSlide =
  document.querySelector(".slide-content");

const initialTitle =
  splitTitle(initialSlide);

const initialLines =
  splitLines(initialSlide);

gsap.fromTo(
  initialTitle.chars,
  {
    y: "100%",
  },
  {
    y: "0%",
    duration: 0.8,
    stagger: 0.015,
    ease: "power2.out",
  }
);

gsap.fromTo(
  initialLines,
  {
    y: "100%",
  },
  {
    y: "0%",
    duration: 0.8,
    stagger: 0.025,
    ease: "power2.out",
    delay: 0.2,
  }
);


function transition() {
  if (isTransitioning) return;

  isTransitioning = true;

  if (rippleTween) {
    rippleTween.kill();

    uniforms.uProgress.value = 0;

    rippleTween = null;
  }

  const nextIndex =
    (currentIndex + 1) % slides.length;

  const currentSlide =
    document.querySelector(".slide-content");

  const nextTexture =
    textures[nextIndex];


  uniforms.uTexCurrent.value =
    nextTexture;

  uniforms.uTexNext.value =
    nextTexture;

  uniforms.uImageRes.value.set(
    nextTexture.userData.width,
    nextTexture.userData.height
  );

  uniforms.uProgress.value = 0;

  rippleTween = gsap.to(
    uniforms.uProgress,
    {
      value: rippleConfig.endValue,
      duration: rippleConfig.duration,
      ease: rippleConfig.ease,

      onComplete() {
        uniforms.uProgress.value = 0;

        currentIndex = nextIndex;

        isTransitioning = false;

        rippleTween = null;
      },
    }
  );

  const nextSlide =
    buildSlideElement(slides[nextIndex]);

  slider.appendChild(nextSlide);

  gsap.set(nextSlide, {
    position: "absolute",
    inset: 0,
  });

  const master = gsap.timeline({
    onComplete() {
      currentSlide.remove();

      nextSlide.style.position = "";
      nextSlide.style.inset = "";
    },
  });

  master.add(
    animateTextOut(currentSlide),
    0
  );

  master.add(
    animateTextIn(nextSlide),
    0.2
  );
}

slider.addEventListener(
  "click",
  transition
);


function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();
