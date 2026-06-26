import React from 'react'
import PixelWrapper from './PixelWrapper';

const Works = () => {
  const slides = Array.from({length:22},((_,i)=>`/${(i%8) + 1}.webp`));
  console.log(slides);
  
  //return an array of objects index wise filled
  /*
  const config = slides.map((image, index) => ({
    image,
    title: [
      "Architecture Study",
      "Urban Landscapes",
      "Abstract Forms",
      "Light & Shadow",
      "Mountain Peaks",
      "Nature's Canvas",
      "Motion Flow",
      "Tag off"
    ][index % 8],

    year: [
      "2024",
      "2024",
      "2023",
      "2023",
      "2023",
      "2022",
      "2026",
      "2020",
    ][index % 8],

    ...[
      // row 1
      {
        left: "4vw",
        top: "0vw",
        width: "22vw",
        height: "28vw",
      },
      {
        left: "34vw",
        top: "8vw",
        width: "18vw",
        height: "22vw",
      },

      // row 2
      {
        left: "20vw",
        top: "40vw",
        width: "19vw",
        height: "24vw",
      },
      {
        left: "50vw",
        top: "48vw",
        width: "41vw",
        height: "26vw",
      },

      // row 3
      {
        left: "8vw",
        top: "86vw",
        width: "20vw",
        height: "26vw",
      },
      {
        left: "42vw",
        top: "100vw",
        width: "24vw",
        height: "18vw",
      },
      {
        left:"70vw",
        top:"80vw",
        width:"20vw",
        height:"30vw",
      },
      {
        left:"70vw",
        top:"0vw",
        width:"26vw",
        height:"28vw",
      }
    ][index % 8],
  }));
  */

  const positions = [
  // row 1
  {
    left: "4vw",
    top: "0vw",
    width: "22vw",
    height: "28vw",
  },
  {
    left: "34vw",
    top: "8vw",
    width: "18vw",
    height: "22vw",
  },

  // row 2
  {
    left: "20vw",
    top: "40vw",
    width: "19vw",
    height: "24vw",
  },
  {
    left: "50vw",
    top: "48vw",
    width: "41vw",
    height: "26vw",
  },

  // row 3
  {
    left: "8vw",
    top: "86vw",
    width: "20vw",
    height: "26vw",
  },
  {
    left: "42vw",
    top: "100vw",
    width: "24vw",
    height: "18vw",
  },
  {
    left: "70vw",
    top: "80vw",
    width: "20vw",
    height: "30vw",
  },
  {
    left: "70vw",
    top: "0vw",
    width: "26vw",
    height: "28vw",
  },
];

const titles = [
  "Architecture Study",
  "Urban Landscapes",
  "Abstract Forms",
  "Light & Shadow",
  "Mountain Peaks",
  "Nature's Canvas",
  "Motion Flow",
  "Tag Off",
];

const years = [
  "2024",
  "2024",
  "2023",
  "2023",
  "2023",
  "2022",
  "2026",
  "2020",
];

const config = slides.map((image, index) => {
  const pos = positions[index % positions.length];
  const group = Math.floor(index / positions.length);

  return {
    image,
    title: titles[index % titles.length],
    year: years[index % years.length],

    left: pos.left,
    top: `${parseFloat(pos.top) + group * 130}vw`,
    width: pos.width,
    height: pos.height,
  };
});

console.log(config);
  
  return (
    <section className='relative min-h-screen w-full px-4 py-6'>
        <div id="selected-works-header">
            <h4 className='text-black tracking-tight leading-[1] text-[4vw]
            '>Selected Works</h4>
        </div>
        <div className="relative w-full mt-10 min-h-[380vw]">
            {config.map((slide, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: slide.left,
                  top: slide.top,
                  width: slide.width === "24vw"? "20vw":slide.width,
                  height: slide.height 
                }}
              >
                <PixelWrapper className='w-full h-full'>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                </PixelWrapper>
          
                <p className="mt-3 text-[1vw] font-mono tracking-tight">
                  {slide.title} — {slide.year}
                </p>
              </div>
            ))}
        </div>
    </section>
  )
}

export default Works