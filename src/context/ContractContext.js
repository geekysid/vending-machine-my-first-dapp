import  { createContext, useEffect, useState } from 'react';
import ContractInstance from '../ContractInstance';

const ContractContext = createContext();

export const IsOwnerStateProvider = ({children}) => {
    const [contractData, setContractData] = useState(false)

    const getContractData = async () => {
        return await ContractInstance.methods.getAllProductIDToProductName().call();
    }

    useEffect( () => {
        setContractData(getContractData());
    }, [])

    return (
        <ContractContext.Provider value={{ contractData, setContractData }} >
            {children}
        </ContractContext.Provider>
    )
}

export default ContractContext;