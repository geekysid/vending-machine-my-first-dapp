import React, { useContext } from 'react';
import UserContext from './context/userContext';
import './style.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import { ContractContextProvider } from './context/ContractContext'

const App = () => {

  const { userAddressState, onAddressChange } = useContext(UserContext);
  // const { userAddressState, onAddressChange } = useContext(UserContext);

  window.ethereum.on('chainChanged', chainID => {
      console.log(`Connected to ${parseInt(chainID, 16)} chainID`);
  });

  window.ethereum.on('accountsChanged', account => {
    console.log(`Account changed: ${account[0]}`)
    onAddressChange();
  });

  window.ethereum.on('disconnect', () => {
    console.log(userAddressState)
  });

  return (
    <>
      <Navbar />
      <ContractContextProvider>
        <Home />
      </ContractContextProvider>
      <Footer />
    </>
  )
}

export default App