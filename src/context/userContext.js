import  { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserStateProvider = ({children}) => {
    UserStateProvider.displayName = "UserStateProvider";
    const [userAddressState, setUserAddressState] = useState()
    let accounts = "";

    // useEffect(() => { connectToWallet() }, [])

    useEffect( () => {
        console.log(`Accounts useEffect: ${userAddressState}`);
        if (!accounts) {
            updateAddress()
        }
    }, [])

    // checking address when page loads
    const updateAddress = async () => {
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            setUserAddressState(accounts[0]);
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
            setUserAddressState(accounts[0]);
            alert(`Your address is: ${accounts[0]}`)
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
            setUserAddressState(accounts[0]);
        } else {
            alert ("please install metamask extension to access this website.")
        }
    }

    return (
        <UserContext.Provider value={{ userAddressState, connectToWallet, onAddressChange }} >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;