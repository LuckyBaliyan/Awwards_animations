import * as THREE from "three";
import { gsap } from "gsap";
import { 
    vertexShader, 
    fragmentShader_V1_ClassicVortex,
    fragmentShader_V2_DoubleHelix,
    fragmentShader_V3_PulsingRings, 
    fragmentShader_V4_ReverseVortex, 
    fragmentShader_V5_ChaoticStorm
} from "./shaders";

const canvas = document.getElementById("loader-canvas");
const clickPrompt = document.querySelector(".click-prompt");
const loader = document.getElementById("loader");

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);


const uniforms = {
    uTransition: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uTime: { value: 0.0 },
    uBorderColor: { value: new THREE.Color('blue') }
}

const geometry = new THREE.PlaneGeometry(2, 2);

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: fragmentShader_V5_ChaoticStorm,
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
})

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const handleResize = ()=>{
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    uniforms.uResolution.value.set(width, height);
}

window.addEventListener('resize', handleResize);

let isRevealed = false;

window.addEventListener('click', ()=>{
    if (isRevealed) return;
    isRevealed = true;

    if(clickPrompt){
        gsap.to(clickPrompt,{
            opacity: 0,
            y: -25,
            duration: .5,
            ease: 'power2.inOut',
        })
    }

    gsap.to(uniforms.uTransition, {
        value: 1.0,
        duration: 3.0,
        ease: 'power2.inOut',
        onComplete: ()=>{
            if (loader){
                loader.style.pointerEvents = 'none';
            }
        }
    })
})


const clock = new THREE.Clock();

const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();
    uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();