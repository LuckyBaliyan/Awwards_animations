import React from 'react'
import './style.scss';
import { useNavigate } from 'react-router';

const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className='nav'>
       <ul>
        <li onClick={()=>navigate("/")}>Home</li>
        <span className="line"></span>
        <li onClick={()=>navigate("/about")}>About</li>
       </ul>
    </nav>
  )
}

export default Nav