import React, { useContext } from 'react';
import UserContext from '../context/userContext';

const VendingMachine = () => {
    const { userAddressState } = useContext(UserContext);
    return (
        <div>You are connected through {userAddressState}</div>
    )
}

export default VendingMachine