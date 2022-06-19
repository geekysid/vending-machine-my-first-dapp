import React from 'react'
import './style.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';


const App = () => {
  console.log(process.env.REACT_APP_INFURA_ID);
  const { chains, provider } = configureChains(
      [ chain.rinkeby ],
      [
          infuraProvider({ infuraId: process.env.INFURA_ID }),
          publicProvider()
      ]
  );

  const { connectors } = getDefaultWallets({
      appName: 'Vending Machine DAPP',
      chains
  });

  const wagmiClient = createClient({
      autoConnect: true,
      connectors,
      provider
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
        accentColor: '#3e3e3e',
        accentColorForeground: '#e9e9e9',
        fontStack: 'rounded',
        borderRadius: "medium"
      })}>
        <Navbar />
        <Home />
        <Footer />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App