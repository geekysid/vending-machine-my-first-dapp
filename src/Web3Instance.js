import Web3 from 'web3';

const detectProvider = () => {
    if (window.ethereum) {
        return window.ethereum;
    } else if (window.web3) {
        return window.web3.currentProvider;
    } else {
        console.log("No Ethereum provider found. Please consider installing Metamask plugin.")
    }
}

const provider = detectProvider();
export const Web3Instance = new Web3(provider);
