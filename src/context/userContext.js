import  { createContext, useEffect, useState } from 'react';
import { OwnerAddress } from '../ContractAddress_local';

const UserContext = createContext();

export const UserStateProvider = ({children}) => {
    UserStateProvider.displayName = "UserStateProvider";
    const [userAddressState, setUserAddressState] = useState()
    const [isOwnerState, setIsOwnersState] = useState()
    let accounts = "";

    // useEffect(() => { connectToWallet() }, [])

    useEffect( () => {
        // console.log(`Accounts useEffect: ${userAddressState}`);
        if (!accounts) {
            updateAddress()
        }
    }, [])

    // update userAddressStateand isOwnerState
    const updateUserContext = account => {
        setUserAddressState(account);
        setIsOwnersState(OwnerAddress.toLowerCase() === account.toLowerCase() ? true : false)
    }

    // checking address when page loads
    const updateAddress = async () => {
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            updateUserContext(accounts[0]);
        } else {
            alert ("please install metamask extension to access this website.")
        }
    }

    // handelimg change in address
    const onAddressChange =  async () => {
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            updateUserContext(accounts[0]);
            // alert(`Your address is: ${accounts[0]}`)
        } else {
            alert ("please install metamask extension to access this website.")
        }
    }

    // connecting to wallet
    const connectToWallet = async () => {
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            updateUserContext(accounts[0]);
        } else {
            alert ("please install metamask extension to access this website.")
        }
    }

    return (
        <UserContext.Provider value={{ userAddressState, isOwnerState, connectToWallet, onAddressChange }} >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;