import  { createContext, useEffect, useState } from 'react';

const IsOwnerContext = createContext();

export const IsOwnerStateProvider = ({children}) => {
    IsOwnerStateProvider.displayName = "IsOwnerStateProvider";
    const [IsOwnerState, setIsOwnerState] = useState(false)

    // useEffect(() => { connectToWallet() }, [])

    useEffect( () => {
        console.log(`Accounts useEffect: ${IsOwnerState}`);
        if (!accounts) {
            updateAddress()
        }
    }, [])

    return (
        <IsOwnerContext.Provider value={{ IsOwnerState, connectToWallet, onAddressChange }} >
            {children}
        </IsOwnerContext.Provider>
    )
}

export default IsOwnerContext;