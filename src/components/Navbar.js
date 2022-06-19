import React from 'react';
import Logo from './Logo';
import ProjectHeader from './ProjectHeader';

const Navbar = () => {
  return (
    <nav className="nav-container">
        <Logo />
        <ProjectHeader />
    </nav>
  )
}

export default Navbar