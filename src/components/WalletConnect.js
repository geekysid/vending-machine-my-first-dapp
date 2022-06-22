import React, { useContext } from 'react';
import UserContext from '../context/userContext'

const WalletConnect = () => {
    const { _, connectToWallet } = useContext(UserContext);


    return (
        <div className="home--section--login-box">
            <div className="login-box--header bold">
                Please connect your wallet
            </div>
            <div className="login-box--main">
                <div className="login-box--main--btn" onClick={() => connectToWallet()}>
                    <div className="login-box--main--btn-text bolder">
                        Connect
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletConnect;