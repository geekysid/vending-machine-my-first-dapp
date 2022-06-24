import React, { useContext } from 'react';
import WalletConnect from './WalletConnect';
import VendingMachine from './VendingMachine';
import UserContext from '../context/userContext';
import Admin from './Admin';
import User from './User';

const Home = () => {
  const { userAddressState, isOwnerState } = useContext(UserContext);

  return (
      <div className="home">
        <div className="home--section">
          { userAddressState ? <VendingMachine /> : <WalletConnect /> }
        </div>
        <div className="main-section">
          {  isOwnerState ? <Admin /> : <User />}
        </div>
      </div>
  )
}

export default Home