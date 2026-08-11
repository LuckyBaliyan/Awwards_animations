window.addEventListener("DOMContentLoaded", () => {
      //total number of slides
      const totalSlides = 8;

      //make an array of all public folder images 
      const slideImages = Array.from({ length: totalSlides }, (_, i) =>
            `../public/${i + 1}.webp`,
      );

      const slideTitles = [
            "Crimson Muse",
            "Azure Soul",
            "Velvet Noir",
            "Electric Dreams",
            "Faded Echo",
            "Wild Reverie",
            "Midnight Muse",
            "Neon Grace",
      ]

      const slider = document.querySelector(".slider");
      const orbit = document.querySelector(".orbit");
      const stage = document.querySelector(".stage");
      const titleTag = document.querySelector(".title");
      const previewBox = document.querySelector(".preview");

      const orbitRadius = 400;
      const angleBtweenSlides = 360 / totalSlides;

      //make the image slides form slideImages

      slideImages.forEach((imageSrc, slideNumber) => {
            const slide = document.createElement("div");
            slide.classList.add("panel");

            slide.innerHTML = `
                  <img src="${imageSrc}" alt="">
            `;

            const angle = slideNumber * angleBtweenSlides;
            slide.style.transform = `rotateY(${angle}deg) translateZ(${orbitRadius}px)`;
            orbit.appendChild(slide);
      })


      const previewImg = document.createElement("img");
      previewImg.classList.add("preview-img");
      previewImg.src = slideImages[0];
      previewBox.appendChild(previewImg);

      //provide the easing , speed of rotation effect
      //if we directly say transfrom orbit to targetRotation it will directly goes to 0 --> targetRotation deg
      //but we want to make it smooth so we use lerp i.e linear interpolation method
      const lerp = (from, to, amount) => from + (to - from) * amount;
      const smoothing = 0.05;

      let targetRotation = 0;
      let currentRotation = 0;

      //provide the smooth scrolling rotation
      //suppose user scroll down deltaY = 100 and target rotate --> 100 * 0.2 = subtracted by 20 deg later we rotateY orbit 
      //with this targetRotaton i.e by -20 deg , -30deg accordng to user scroll
      window.addEventListener("wheel", (e) => {
            //this multiplication by 0.2 will limit the delta value with valid deg range
            //this is basically called scroll sensitivity 
            //larger sensitivity faster animation on scroll

            targetRotation -= e.deltaY * 0.28;  // use + if u want reverse rotation

            //check via console
            console.log(targetRotation);

      }, { passive: true });

      //gives the info about current active slide
      let shownIndex = 0;

      function showActiveSlide() {
            //gives a proper indexed value of angles from the currentRotation value
            //e.g if currentRotation = 23.5 deg then steps = 0 so activeIndex = 0
            //if currentRotation = 52.5 deg then steps = 1 so activeIndex = 1 and so on...
            //in short it gives the exact index value of the currently active slide
            const steps = Math.floor(-currentRotation / angleBtweenSlides);

            //bound the idx value from 0 - 9 
            //why this extra + totalslides  % totalslides ?
            //because unlike java js % can generate -ve values with modulo 
            //e.g -1 % 8 == -1 in js but in java -1 % 8 = 7 
            const activeIndex = ((steps % totalSlides) + totalSlides) % totalSlides;

            //only update the preview image if showIndex changes i.e steps changes by rotation and rotation by user scroll
            //this prevents uncessary DOM updates during requestAnimationFrame loop
            if (shownIndex !== activeIndex) {
                  shownIndex = activeIndex;
                  previewImg.src = slideImages[activeIndex];
                  titleTag.innerText = slideTitles[activeIndex];
            }
      }

      //for tilt effect
      const maxTilt = 30;
      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;

      slider.addEventListener("mousemove", (e) => {
            //calculate the pointer distance from center
            const distanceFromCenterX = e.clientX / window.innerWidth - 0.5;
            const distanceFromCenterY = e.clientY / window.innerHeight - 0.5;

            //apply to targetTilt within same mouse direction
            targetTiltY = distanceFromCenterX * maxTilt;
            targetTiltX = -distanceFromCenterY * maxTilt;
      });

      //when mouse not moving no tilt
      slider.addEventListener("mouseleave", () => {
            targetTiltX = 0;
            targetTiltY = 0;
      });

      function updateTilt() {
            //same lerp used to provide smooth transition
            currentTiltX = lerp(currentTiltX, targetTiltX, smoothing);
            currentTiltY = lerp(currentTiltY, targetTiltY, smoothing);

            //instead of the small ring we are tilting the complete parent stage u can see it by 
            //giving it a bg color from css
            //we added minus sign so that the tilt direction is same as mouse movement
            stage.style.transform = `rotateX(${-currentTiltX}deg) rotateY(${-currentTiltY}deg)`;
      }

      /*
      The animate() loop and the wheel event are two independent things
      it will keep updating values on each wheel event change and keep running as long as
      page in bowser */
      function animate() {
            currentRotation = lerp(currentRotation, targetRotation, smoothing);
            orbit.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
            previewBox.style.transform = `translate(-50%, -50%) rotateY(${-currentRotation}deg)`;

            //update preview image and title
            showActiveSlide();
            //update tilt
            updateTilt();

            //conitnues looped function with 60fps
            //it tells browser before next screen repaint call animate() function
            //we alternativly use setTimeOut but this function is specifially designed 
            //for smooth animations and prevents unnecessary re-rendering
            //One must not confuse its not infinite recursion it's call are stored in web api queue
            //and keep popping and inserting time after time 
            requestAnimationFrame(animate);
      }

      //call the animate function to start for first time
      animate();
})