import React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import assets from '../../assets'

//Making some presets for the complete layout in both desktop and mobile devices.
const PANEL_WIDTH_COLLAPSED = 20;
const PANEL_WIDTH_EXPANDED = 400;
const PANEL_WIDTH_EXPANDED_MOBILE = 100;
const PANEL_GAP = 5;
const PANEL_COUNT_DEKSTOP = 20;
const PANEL_COUNT_MOBILE = 10;
const MOBILE_BREAKPOINT = 1000;

const Spotlight = () => {
  const trackRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [focusedPanel, setFocusedPanel] = useState(0);

  const panelCount = isMobile ? PANEL_COUNT_MOBILE : PANEL_COUNT_DEKSTOP;
  const expandedWidth = isMobile ? PANEL_WIDTH_EXPANDED_MOBILE : PANEL_WIDTH_EXPANDED;

  //used Resize Observer to set the trackwidth with everytime measured width 
  useEffect(()=>{
    const observer = new ResizeObserver(([entry])=>{
       setTrackWidth(entry.contentRect.width);
       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    });
    if(trackRef.current) observer.observe(trackRef.current);
    return ()=> observer.disconnect();
  },[]);

  //reset the focusedpanel on basis of panelCount when the view-port (device) changes 
  useEffect(()=>{
    setFocusedPanel(0);
  },[panelCount]);


  //now we will calculate the each panel position and all of our functions will be wrapped by 
  // useCallback to prevent any uncessary calculations on each render
  const getPanelPosition = useCallback((panelIndex)=>{
    const totalTrackWidth = 
          (panelCount - 1) * (PANEL_WIDTH_COLLAPSED + PANEL_GAP) + expandedWidth;
   
    //new center position for the panels due to resizing ex:- old:- 200 new:- 100
    // center = ( 100 - 200 ) / 2 = -50 i.e we need to translate x == -50%
    const offsetCenter = (trackWidth - totalTrackWidth) / 2;
    
    let left = offsetCenter;
    for(let i = 0; i< panelIndex; i++){
        let w = i === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;
        left += w + PANEL_GAP; // decrease the width of panel from the total displacement 
        // ex:- panel len :- 20 so actual center == -50 + 20 = 30
    }

    const width = panelIndex === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;

    //return the style object to later applied via html style attribute 
    return {left, width};
   },
    [focusedPanel, panelCount, expandedWidth, trackWidth]
  );

  const focusPanel = useCallback((index)=>{
       setFocusedPanel(index);
  },[]);

  const getPanelIndicatorPosition = useCallback(()=>{
    return getPanelPosition(focusedPanel);
  },[focusedPanel, getPanelPosition]);


  return (
   <section className="spotlight">
        <div className="spotlight-track" ref={trackRef}>
            <div className="spotlight-panels"
            >
            <div className="spotlight-focus-indicator" 
            style={getPanelIndicatorPosition()}/>
                {
                    Array.from({length: panelCount}, (_,i)=>(
                      <div className="spotlight-panel"
                      key={`${isMobile?'m':'d'}-${i}`}
                      style={getPanelPosition(i)}
                      onMouseEnter={!isMobile ? ()=> focusPanel(i) : undefined}
                      onClick={isMobile ? ()=> focusPanel(i) : undefined}
                      >
                       <img src={assets[i].img} alt="spotlight-img" />
                      </div>
                    ))
                }
            </div>
            <div className="spotlight-content">
                <h2 key={focusedPanel}>
                  {assets[focusedPanel].title}
                </h2>
              
                <div className="spotlight-lines">
                  {assets[focusedPanel].lines.map((line, i) => (
                    <p
                      key={`${focusedPanel}-${i}`}
                      style={{
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
            </div>
        </div>
   </section>
  )
}

export default Spotlight