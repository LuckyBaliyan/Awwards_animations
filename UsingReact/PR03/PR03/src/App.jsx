import React from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Nav from './components/ui/nav/Nav'
import Wrapper from './layouts/Wrapper'

const App = () => {
  return (
    <main>
    <Nav/>
    <Wrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Wrapper>
    </main>
  )
}

export default App;