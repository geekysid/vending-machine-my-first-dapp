import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Login = () => {
    return (
        <ConnectButton
            chainStatus="icon"
            accountStatus='full'
            showBalance={true}
        />
    )
}

export default Login