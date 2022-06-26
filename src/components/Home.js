import React, { useContext } from 'react';
import WalletConnect from './WalletConnect';
import Shop from './Shop';
import UserContext from '../context/userContext';

const Home = () => {
  const { userAddressState } = useContext(UserContext);

  return (
      <div className="home">
        <div className="home--section">
          { userAddressState ? <Shop /> : <WalletConnect /> }
        </div>
      </div>
  )
}

export default Home