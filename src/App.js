import React, { useContext } from 'react';
import './style.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import UserContext from './context/userContext';
import { ContractContextProvider } from './context/ContractContext';
import SpinnerContext from './context/SpinnerContext';
import Spinner from './components/Spinner';

const App = () => {

  const { userAddressState, onAddressChange } = useContext(UserContext);
  const { spinnerState } = useContext(SpinnerContext);
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
        {
          spinnerState
          &&
          <Spinner />
        }
        <Navbar />
        <ContractContextProvider>
          <Home />
        </ContractContextProvider>
        <Footer />
    </>
  )
}

export default App