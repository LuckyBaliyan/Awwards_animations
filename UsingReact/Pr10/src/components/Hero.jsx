import React, { useRef } from "react";
import { artists } from "../utils/constants";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import gsap from "gsap";

gsap.registerPlugin(Observer);

const slicesPerCard = 120;
const gap = 0.1;
const normalSpeed = 0.01;

/**
 * Hero Component
 * Renders an interactive 3D cylindrical carousel of artist cards on a 2D HTML5 canvas.
 * Manages canvas lifecycle, GSAP animations, ticker updates, and user drag interactions.
 */
const Hero = () => {
      const canvasRef = useRef(null);

      useGSAP(() => {
            const canvas = canvasRef.current;
            const cntx = canvas.getContext("2d");

            // moved inside so every mount starts fresh
            const ring = { angle: 0, speed: normalSpeed, tilt: -0.2 };

            let cards = [];
            let cancelled = false;
            let observer;

            /**
             * createCard
             * Creates an offscreen virtual canvas for an individual artist card.
             * Pre-renders the artist portrait, name, and role into a reusable image buffer to ensure high-performance rendering.
             * 
             * @param {Object} artist - The artist data object containing name, role, and photo hash.
             * @returns {HTMLCanvasElement} The offscreen canvas element containing the pre-rendered card.
             */
            function createCard(artist) {
                  const card = document.createElement("canvas");
                  card.width = 1200;
                  card.height = 1600;
                  const cardCtx = card.getContext("2d");

                  const photo = new Image();
                  photo.src = `https://assets.lummi.ai/assets/${artist.photo}?w=1120&h=1240&fit=crop&crop=faces`;
                  photo.onload = () => {
                        cardCtx.fillStyle = "#0b0b0b";
                        cardCtx.fillRect(0, 0, 1200, 1600); // was 12000

                        cardCtx.drawImage(photo, 40, 40);

                        cardCtx.font = "500 80px Syne";
                        cardCtx.fillStyle = "white";
                        cardCtx.fillText(artist.name, 40, 1420);

                        cardCtx.font = "500 48px Syne";
                        cardCtx.fillStyle = "#f26e33";
                        cardCtx.fillText(artist.role, 40, 1505);
                  };

                  return card;
            }

            /**
             * resize
             * Synchronizes the canvas dimensions with the window size and display pixel ratio.
             * Ensures sharp, non-blurry graphics across standard and Retina / High-DPI screens.
             */
            function resize() {
                  canvas.width = innerWidth * devicePixelRatio;
                  canvas.height = innerHeight * devicePixelRatio;
            }

            /**
             * pointRing
             * Projects a point on a 3D circle at a specified angle and radius onto 2D canvas coordinates.
             * Computes perspective depth using cosine and horizontal positioning using sine.
             * 
             * @param {number} angle - The angle on the circle in radians.
             * @param {number} radius - The radius of the cylindrical ring in pixels.
             * @returns {{x: number, y: number, scale: number}} Projected 2D position and perspective scale.
             */
            function pointRing(angle, radius) {
                  const depth = Math.cos(angle);
                  const scale = 1 + depth * 0.25;
                  return {
                        x: Math.sin(angle) * radius * scale,
                        y: depth * radius * 0.2,
                        scale,
                  };
            }

            /**
             * drawRing
             * Slices each artist card into vertical strips and renders them around the cylinder.
             * Handles double-sided rendering by drawing the textured image when facing forward
             * and a clean card-stock backing when facing backward.
             * 
             * @param {"front" | "back"} side - Specifies whether to draw the front or back facing slices.
             */
            function drawRing(side) {
                  const radius = Math.min(canvas.width * 0.4, canvas.height * 0.5);
                  const slotAngle = (Math.PI * 2) / cards.length;
                  const cardAngle = slotAngle * (1 - gap);
                  const sliceAngle = cardAngle / slicesPerCard;
                  const cardHeight = radius * cardAngle * 1.33;

                  cards.forEach((card, cardIndex) => {
                        const sliceWidth = card.width / slicesPerCard; // renamed, no clash with loop var

                        for (let slice = 0; slice < slicesPerCard; slice++) {
                              const angle = ring.angle + cardIndex * slotAngle + slice * sliceAngle;
                              const start = pointRing(angle, radius);
                              const end = pointRing(angle + sliceAngle, radius);
                              const height = cardHeight * start.scale;
                              const top = start.y - height / 2;

                              if (side === "front" && end.x > start.x) {
                                    cntx.drawImage(
                                          card,
                                          slice * sliceWidth, 0, sliceWidth, card.height,
                                          start.x, top, end.x - start.x + 1, height
                                    );
                              }

                              if (side === "back" && end.x < start.x) {
                                    cntx.fillStyle = "#d8d4ce";
                                    cntx.fillRect(end.x, top, start.x - end.x + 1, height);
                              }
                        }
                  });
            }

            /**
             * tick
             * Main animation loop callback executed on every frame via GSAP ticker.
             * Advances the ring's rotational angle, clears the screen, applies center transforms & tilt,
             * and draws both back and front layers of the cylinder in proper depth order.
             */
            function tick() {
                  ring.angle += ring.speed * gsap.ticker.deltaRatio();

                  cntx.clearRect(0, 0, canvas.width, canvas.height);
                  cntx.save();
                  cntx.translate(canvas.width / 2, canvas.height * 0.47);
                  cntx.rotate(ring.tilt);
                  drawRing("back");
                  drawRing("front");
                  cntx.restore();
            }

            /**
             * init
             * Asynchronously prepares and starts the carousel experience.
             * Awaits custom font loading, pre-renders cards, attaches event listeners,
             * sets up GSAP idle oscillation tweens, and configures touch/pointer gesture inertia.
             */
            async function init() {
                  await document.fonts.load("500 80px Syne");
                  if (cancelled) return;

                  cards = artists.map(createCard);
                  resize();
                  window.addEventListener("resize", resize);
                  gsap.ticker.add(tick);

                  gsap.from(ring, { speed: 0.12, duration: 3, ease: "power3.out" });
                  gsap.to(ring, { tilt: -0.12, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });

                  observer = Observer.create({
                        type: "touch,pointer",
                        preventDefault: true,
                        onChange: (self) => {
                              const spin = (self.deltaX + self.deltaY) * 0.002;
                              gsap.fromTo(
                                    ring,
                                    { speed: spin },
                                    { speed: normalSpeed, duration: 2, overwrite: "auto" }
                              );
                        },
                  });
            }

            init();

            // cleanup
            return () => {
                  cancelled = true;
                  window.removeEventListener("resize", resize);
                  gsap.ticker.remove(tick);
                  gsap.killTweensOf(ring);
                  observer?.kill();
            };
      }, []);

      return (
            <canvas
                  ref={canvasRef}
                  className="fixed inset-0 w-full h-full cursor-grab touch-none"
            />
      );
};

export default Hero;