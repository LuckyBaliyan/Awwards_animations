import React from 'react'
import { setupLenisScroll } from './components/Animations/utils/stripeMask';
import Hero from './components/ui/sections/Hero';
import StripMask from './components/Animations/StripeReveal/StripMask';
import Footer from './components/ui/sections/Footer';

const App = () => {
  //Global Scroll behaviour
  setupLenisScroll();

  return (
    <main>
      <Hero />
      <StripMask/>
      <Footer />
    </main>
  )
}

export default App;