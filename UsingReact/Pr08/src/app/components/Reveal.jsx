import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrambleTextPlugin } from 'gsap/all'

//plugin used to make randomized text reveal animation
gsap.registerPlugin(ScrambleTextPlugin);

//CONSTANT VALUES
const config = {
      ASCII_CHARS: ".:-=+*#%@", //sorted according to the brightness of pixel during image drawing
      SCAMBLE_CHARS: "#%@=+*",
      COLUMS: 25,
      ROWS: 22,
};

const Reveal = () => {

      const imagesRef = useRef([]);

      //returns the array of generated ascii characters
      function generateAsii(image) {
            const imageRatio = image.naturalWidth / image.naturalHeight;
            const frameRatio = 4 / 5;

            let cropX = 0;
            let cropY = 0;

            let cropWidth = image.naturalWidth;
            let cropHeight = image.naturalHeight;

            //crop the image back to 4 / 5 ratio
            if (imageRatio > frameRatio) {
                  cropWidth = image.naturalWidth * frameRatio;
                  cropX = (image.naturalWidth - cropWidth) / 2;
            } else {
                  cropHeight = image.naturalWidth / frameRatio;
                  cropY = (image.naturalHeight - cropHeight) / 2;
            }

            //make a canvas of same area 
            const canvas = document.createElement("canvas");
            canvas.width = config.COLUMS;
            canvas.height = config.ROWS;

            const context = canvas.getContext("2d");
            context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, config.COLUMS, config.ROWS);

            //get image data
            //gives a contigeous array of repeating values of rgba values like
            // 0 0 255 0 or maybe different like in my case of logging for first image
            //is 0 0 904 1200 they give the pixel of red, green, blue and alpha pixel values 4 for each image
            const { data } = context.getImageData(0, 0, config.COLUMS, config.ROWS);

            console.log(data);

            const chars = [];

            //loop through all the pixel values
            for (let i = 0; i < config.COLUMS * config.ROWS; i++) {
                  //every 4th index tells about next image data
                  const pixel = i * 4;

                  //ex:- RGB is 255 100 50 --> 255 + 100 + 50 / 3 = 135 
                  //now w.k.t that rgba upperbound is 255 just calculate % or ratio from that val
                  //i.e 135 / 255 = 0.529 is our brightness value
                  const brightness = (data[pixel] + data[pixel + 1] + data[pixel + 2]) / 3 / 255;

                  //get the current char from already sorted string of characters best fit for current brightness
                  const charIdx = Math.round((1 - brightness) * (config.ASCII_CHARS.length - 1));

                  // push that in array
                  chars.push(config.ASCII_CHARS[charIdx]);
            }

            return chars;
      }

      //animation function to be run for each and every image 
      function animateTile(image, delay) {
            const ascii = document.createElement("div");
            ascii.className = "ascii";

            const cells = generateAsii(image).map((char) => {
                  const span = document.createElement("span");
                  //store rather then assign as textContent bcause later gsap can use it in scrammballing the text
                  span.dataset.char = char;
                  ascii.appendChild(span);
                  return span;
            });

            //append to the tile container div
            image.parentElement.appendChild(ascii);

            //tweening
            gsap.to(cells, {
                  delay,
                  duration: 1,
                  //scramling text
                  scrambleText: (index, span) => ({
                        text: span.dataset.char,
                        chars: config.SCAMBLE_CHARS,
                        speed: 1,
                        tweenLength: false,
                  }),
                  stagger: { each: 0.009, from: "random" },
                  //hide the ascii frame when evrything gets completed
                  onComplete: () => {
                        gsap.to(ascii, { autoAlpha: 0, duration: 0.6, delay: 0.4 });
                  }
            });
      }

      useGSAP(() => {
            imagesRef.current.forEach(async (img, idx) => {
                  if (!img) return;

                  try {
                        //wait until all the images are loading we can't perform 
                        //canvas animations until we don't get each rendered pixel
                        //and it's info also good ux we can show loader till then as well using loading state
                        await img.decode();

                        if (!img.naturalWidth || !img.naturalHeight) return;

                        //everything ready then jai baba ki ...
                        animateTile(img, idx * 0.15);

                  } catch (error) {
                        console.error("Failed to load image:", img.src);
                  }
            });
      }, []);

      return (
            <div className="gallery">
                  {Array.from({ length: 8 }).map((img, idx) => (
                        <div className="tile" key={idx}>
                              <img
                                    ref={(el) => (imagesRef.current[idx] = el)}
                                    crossOrigin='anonymous'
                                    src={`${idx + 1}.webp`}
                                    alt="gallery-image"
                                    className='absolute inset-0 w-full h-full object-cover'
                              />
                        </div>
                  ))}
            </div>
      )
}

export default Reveal