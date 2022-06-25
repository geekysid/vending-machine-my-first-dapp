import React, { useContext } from 'react';
import WalletConnect from './WalletConnect';
import VendingMachine from './VendingMachine';
import UserContext from '../context/userContext';

const Home = () => {
  const { userAddressState } = useContext(UserContext);

  return (
      <div className="home">
        <div className="home--section">
          { userAddressState ? <VendingMachine /> : <WalletConnect /> }
        </div>
      </div>
  )
}

export default Home