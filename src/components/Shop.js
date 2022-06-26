import React, { useContext } from 'react';
import UserContext from '../context/userContext';
import Admin from './Admin';
import User from './User';
import Withdraw from './Withdraw';

const VendingMachine = () => {
    const { isOwnerState } = useContext(UserContext);

    return (
        <div className="shop">
            {
                isOwnerState
                &&
                <>
                    <div className="shop--header bold">
                        <span>Contract Balance</span>
                    </div>
                    { <Withdraw /> }
                </>
            }
            <div className="shop--header bold">
                <span>Vending Machine</span>
            </div>
            {  isOwnerState ? <Admin /> : <User /> }
        </div>
    )
}

export default VendingMachine