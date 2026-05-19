import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './nav.scss'

const Nav = () => {

  const navigate = useNavigate()

  const handleTransition = (path) => {

    if (!document.startViewTransition) {
      navigate(path)
      return
    }

    document.startViewTransition(() => {
      navigate(path)
    })
  }

  return (
    <nav>

      <p
        className='link'
        onClick={() => handleTransition('/')}
      >
        Home |
      </p>

      <p
        className='link'
        onClick={() => handleTransition('/work')}
      >
        Works |
      </p>

      <p
        className='link'
        onClick={() => handleTransition('/carrers')}
      >
        Carrers
      </p>

    </nav>
  )
}

export default Nav