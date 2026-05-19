import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './Pages/Home'
import Work from './Pages/Work'
import Carrers from './Pages/Carrers'
import Nav from './components/ui/nav/Nav'

const App = () => {
  return (
    <>
      <Nav/>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/work' element={<Work/>} />
          <Route path='/carrers' element={<Carrers/>} />
      </Routes>
    </>
  )
}

export default App