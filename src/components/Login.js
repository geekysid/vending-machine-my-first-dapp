import React, { useContext } from 'react';
import UserContext from '../context/userContext';

const Login = () => {
    const { userAddressState, disconnectWallet } = useContext(UserContext);

    const formatAddress = () => {
        if (userAddressState) {
            return `${userAddressState.substring(0, 5)}.....${userAddressState.substring(userAddressState.length-5, userAddressState.length)}`
        }
    }

    return (
        <>
        {
            userAddressState
            ?
            <div className="address-holder">
                <div className="address-holder--avatar">
                    <img src="/images/happy.png" alt="avatar" className="address-holder--avatar--img" />
                </div>
                <div className="address-holder--text bold">{formatAddress()}</div>
                <div id="disconnect-btn" className="address-holder--disconnect" onClick={disconnectWallet}>
                    <img id="disconnect-btn--img" src="/images/disconnect-2.png" alt="" className="address-holder--disconnect-img" />
                </div>
            </div>
            :
            <div></div>
        }
        </>
    )
}

export default Login