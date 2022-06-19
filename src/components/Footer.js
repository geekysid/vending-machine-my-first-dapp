import React from 'react'

const Footer = () => {
  return (
    <footer className="footer-container">
        <span className="footer-container--text">
            This DAPP is developerd by <span className="semi-bold">Siddhant Shah</span> for practicing purpose.
        </span>
        <div className="footer-conatiner--tech">
            <img src="/images/html5.svg" title="HTML5" alt="html5" className="img html-logo" />
            <img src="/images/javascript.svg" title="JavaScript" alt="javascript" className="img html-logo" />
            <img src="/images/react.svg" title="React" alt="react" className="img html-logo" />
            <img src="/images/solidity.svg" title="Solidity" alt="solidity" className="img html-logo" />
            <img src="/images/truffle.svg" title="Truffle" alt="truffle" className="img html-logo" />
            <img src="/images/ganache.svg" title="Ganache" alt="ganache" className="img html-logo" />
            <img src="/images/web3js.svg" title="Wb3js" alt="web3js" className="img html-logo" />
            <img src="/images/ethereum.svg" title="Ethereum" alt="ethereum" className="img html-logo" />
            <img src="/images/IPFS.svg" title="IPFS" alt="IPFS" className="img html-logo" />
        </div>
    </footer>
  )
}

export default Footer