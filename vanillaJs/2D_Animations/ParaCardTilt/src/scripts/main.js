import gsap from "gsap";

//track the device
const DESKTOP_MIN = 1000;
//maximum card rotation offset
const TILT_MAX = 25;
//maximum distance the card is allowed to follow the cursor
const DRIFT_MAX = 25;
//smoothness
const SMOOTHING = 0.075;

//Crad states later used to pass to gsap
const CARD_OPEN = { width: "18rem", height: "14rem", borderRadius: "0.4rem" };
const CARD_DOT = { width: "0.4em", height: "0.4em", borderRadius: "0.04em" };

//card centered state
const CARD_CENTERED = {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      // these -50 -50 stays crad to dot center point similar to translate(-50%, -50%)
      xPercent: -50,
      yPercent: -50,
};

//helper function to check we are on desktop or not
const isDesktop = () => window.innerWidth >= DESKTOP_MIN;

//comman logic for every spot
document.querySelectorAll(".spot").forEach((spot) => {
      //elements inside each spot
      const card = spot.querySelector(".spot-card");
      const image = spot.querySelector("img");

      //current card state to be passed later on lerp
      const live = { x: 0, y: 0, tiltX: 0, tiltY: 0 };
      //final card state to be passed later on lerp
      const aim = { x: 0, y: 0, tiltX: 0, tiltY: 0 };

      //helps to tell is any animation running or not
      let isHovering = false;
      //this holds reference of the animation function that get registered with gsap ticker
      let frame = null;

      const startTracking = () => {
            //complete one frame of animation
            frame = () => {
                  //lerp of position
                  live.x += (aim.x - live.x) * SMOOTHING;
                  live.y += (aim.y - live.y) * SMOOTHING;

                  //lerp of tilt --> rotation
                  live.tiltX += (aim.tiltX - live.tiltX) * SMOOTHING;
                  live.tiltY += (aim.tiltY - live.tiltY) * SMOOTHING;

                  //give the values to gsap
                  gsap.set(card, {
                        x: live.x,
                        y: live.y,
                        rotateX: live.tiltX,
                        rotateY: live.tiltY,
                  });

                  //apply apposite shift of image for parallex effect
                  gsap.set(image, { x: -live.x, y: -live.y });
            }

            //pass reference of current frame to gsap ticker
            //this tells gsap to call frame on every animation tick
            gsap.ticker.add(frame);
      }

      const stopTracking = () => {
            gsap.ticker.remove(frame);
            frame = null;
      }

      const expandCard = () => {
            if (!isDesktop()) return;

            isHovering = true;

            //reset previous any animation values for a fresh start
            Object.assign(live, { x: 0, y: 0, tiltX: 0, tiltY: 0 });
            Object.assign(aim, { x: 0, y: 0, tiltX: 0, tiltY: 0 });

            //again reset the card so it start from center on mouseleave and agian mouseenter
            gsap.set(card, CARD_CENTERED);
            //same for image
            gsap.set(image, { x: 0, y: 0 });

            startTracking();

            //expand the card
            gsap.to(card, {
                  ...CARD_OPEN,
                  duration: 0.75,
                  ease: "power3.out",
                  overwrite: "auto"
                  //overwrite: "auto" means if any animation is running on the card, it will be overwritten
            });

            //imagefade in
            gsap.to(image, {
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
            })
      };

      //call the above function when use hover on dot
      spot.addEventListener("mouseenter", expandCard);

      //following the mouse
      const aimAtCursor = (event) => {
            if (!isHovering || !isDesktop()) return;

            //get spot positions
            const bounds = spot.getBoundingClientRect();

            //example bounds.left = 400 and width = 50 so center is 400 + 50 / 2 = 425
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;

            //distance of mouse from center
            let offsetX = event.clientX - centerX;
            let offsetY = event.clientY - centerY;

            //suppose our mouse if 20px right and 20px above the we find hypotenius and use it as a limit for max drift
            const distance = Math.hypot(offsetX, offsetY);

            if (distance > DRIFT_MAX) {
                  //ex:- 25 / 100 = 0.25
                  const scale = DRIFT_MAX / distance;
                  offsetX *= scale;
                  offsetY *= scale;
            }

            //now we are changing the end point of our lerp basically
            aim.x = offsetX;
            aim.y = offsetY;

            //get the card dimensions for finding the distance b/w card and cursor
            const cardBounds = card.getBoundingClientRect();
            //calculate the ration respective to mouse distance for rotation
            const ratioX = (event.clientX - centerX) / (cardBounds.width / 2);
            const ratioY = (event.clientY - centerY) / (cardBounds.height / 2);

            //clamp the ration so that it wo't go out of desired range
            const clamp = (value) => Math.max(-1, Math.min(1, value));

            //finally another end point value for our rotation lerp
            //ex:- anim.tiltX = 0.5 * 25 = 12.5 deg
            aim.tiltX = clamp(ratioY) * TILT_MAX;
            aim.tiltY = clamp(ratioX) * -TILT_MAX;
      }

      //when  uer move mouse the call this function
      spot.addEventListener("mousemove", aimAtCursor);

      //close the card
      const shrinkCard = () => {
            if (!isDesktop()) return;

            isHovering = false;
            aim.tiltX = aim.tiltY = 0;

            //remove frame from the ticker
            stopTracking();

            //shrink the card to dot size
            gsap.to(card, {
                  ...CARD_DOT,
                  x: 0,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  duration: 0.5,
                  ease: "power3.out",
                  overwrite: "auto",
                  //runs after shrink animation finishes
                  onComplete: () => {
                        if (isHovering) return;

                        gsap.set(card, {
                              //remove the inline CSS properties that GSAP added for these properties.
                              clearProps: "width,height,borderRadius",
                              ...CARD_CENTERED,
                        });

                        gsap.set(image, { x: 0, y: 0 });
                  }
            });

            //fade image out
            gsap.to(image, { opacity: 0, duration: 0.5, ease: "power2.in", overwrite: "auto" })
      };

      //call this function when user leaves the mouse
      spot.addEventListener("mouseleave", shrinkCard);
})