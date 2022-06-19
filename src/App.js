import React from 'react'
import './style.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';

const App = () => {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  )
}

export default App