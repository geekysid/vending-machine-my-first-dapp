import React from 'react';
import Login from './Login';
import Logo from './Logo';
import ProjectHeader from './ProjectHeader';

const Navbar = () => {
  return (
    <nav className="nav-container">
        <Logo />
        {/* <Login /> */}
        <ProjectHeader />
    </nav>
  )
}

export default Navbar