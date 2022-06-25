import React, { useContext } from 'react';
import UserContext from '../context/userContext';
import Admin from './Admin';
import User from './User';


const VendingMachine = () => {
    const { userAddressState, isOwnerState } = useContext(UserContext);

    return (
        <div className="vending-machine">
            <div className="vending-machine--header bold">
                <span>Vending Machine</span>
            </div>
            {  isOwnerState ? <Admin /> : <User />}
        </div>
    )
}

export default VendingMachine