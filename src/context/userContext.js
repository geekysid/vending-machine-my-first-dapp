import  { createContext, useEffect, useState, useContext } from 'react';
import { OwnerAddress } from '../ContractAddress_local';
import SpinnerContext from '../context/SpinnerContext';
import NotificationContext from '../context/NotificationContext';

const UserContext = createContext();

export const UserStateProvider = ({children}) => {
    UserStateProvider.displayName = "UserStateProvider";
    const [userAddressState, setUserAddressState] = useState()
    const [isOwnerState, setIsOwnersState] = useState()
    const { activateSpinner, deactivateSpinner } = useContext(SpinnerContext);
    const { updateNotificationState } = useContext(NotificationContext);

    let accounts = "";

    // useEffect(() => { connectToWallet() }, [])

    useEffect( () => {
        // console.log(`Accounts useEffect: ${userAddressState}`);
        if (!accounts) {
            updateAddress()
        }
    }, [])

    // update userAddressStateand isOwnerState
    const updateUserContext = (account) => {
        setUserAddressState(account);
        setIsOwnersState(OwnerAddress.toLowerCase() === account.toLowerCase() ? true : false)
    }

    // checking address when page loads
    const updateAddress = async () => {
        activateSpinner();
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            if (accounts.length > 0) updateUserContext(accounts[0]);
        } else {
            updateNotificationState(true, {
                type: 'error',
                title: 'error',
                message: `Please install metamask extension to access this website.`
            });
        }
        deactivateSpinner();
    }

    // handelimg change in address
    const onAddressChange =  async () => {
        activateSpinner();
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            updateUserContext(accounts[0]);
            // alert(`Your address is: ${accounts[0]}`)
        } else {
            updateNotificationState(true, {
                type: 'error',
                title: 'error',
                message: `Please install metamask extension to access this website.`
            });
        }
        deactivateSpinner();
    }

    // connecting to wallet
    const connectToWallet = async () => {
        activateSpinner();
        if (window.ethereum) {
            accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            updateUserContext(accounts[0]);
        } else {
            updateNotificationState(true, {
                type: 'error',
                title: 'error',
                message: `Please install metamask extension to access this website.`
            });
        }
        deactivateSpinner();
    }

    // diconnect wallet
    const disconnectWallet = () => {
        setUserAddressState();
        setIsOwnersState(false);
        updateNotificationState(true, {
            type: 'warning',
            title: 'warning',
            message: `You are only disconnected temporarily. Please discconect from your wallet to be disconnected properly.`
        });
    }

    return (
        <UserContext.Provider value={{ userAddressState, isOwnerState, connectToWallet, onAddressChange, disconnectWallet }} >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;