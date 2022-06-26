import  { createContext, useEffect, useState, useContext } from 'react';
import ContractInstance from '../ContractInstance';
import SpinnerContext from './SpinnerContext';
import UserContext from './userContext';
import { formatException } from '../utils';
import NotificationContext from './NotificationContext';

const ContractContext = createContext();

export const ContractContextProvider = ({children}) => {
    const [contractData, setContractData] = useState()
    const [contractBalance, setContractBalance] = useState(0);
    const { activateSpinner, deactivateSpinner } = useContext(SpinnerContext);
    const { isOwnerState, userAddressState } = useContext(UserContext);
    const { updateNotificationState } = useContext(NotificationContext);

    const fetchContractBalance = async () => {
        activateSpinner();
        let data = await ContractInstance.methods.getContractBalance().call();
        setContractBalance(data);
        deactivateSpinner();
    }

    const getContractData = async () => {
        activateSpinner();
        const data = await ContractInstance.methods.getAllProductIDToProductName().call();
        setContractData(data);
        deactivateSpinner();
    }

    useEffect( () => {
        getContractData();
        fetchContractBalance();
    }, [])

    //  getting all enums for Stock
    const getEnumForStock = (filter, type) => {
        let enum_value = "0";
        if ( type === 'key' ) {
            switch (filter) {
            case "OVERFLOW":
                enum_value = "0";
                break;
            case "FULL":
                enum_value = "1";
                break;
            case "OK":
                enum_value = "2";
                break;
            case "LOW":
                enum_value = "3";
                break;
            case "OUT_OF_STOCK":
                enum_value = "4";
                break;
            }
            return enum_value;
        }
        else if ( type === 'value' ) {
            let enum_value = "Unknown";
            switch (filter) {
            case "0":
                enum_value = "OVERFLOW";
                break;
            case "1":
                enum_value = "FULL";
                break;
            case "2":
                enum_value = "OK";
                break;
            case "3":
                enum_value = "LOW";
                break;
            case "4":
                enum_value = "OUT_OF_STOCK";
                break;
            }
            return enum_value;
        }
    }

    // enum StockStatus { OVERFLOW, FULL, OK, LOW, OUT_OF_STOCK }
    const getFilteredProductsOnStock = filter => {
        const enum_value = getEnumForStock(filter, 'key');
        const filteredProducts = [];
        if (contractData){
            contractData.forEach(product => {
                if (product.stockStatus.toString() === enum_value) {
                    filteredProducts.push(product);
                }
            });
        } else {
            // console.log('No Data')
        }
        console.log(filteredProducts)
        return filteredProducts
    }

    // enum ProductStatus { NOT_EXIST, ACTIVE, INACTIVE }
    const getFilteredProductsOnStatus = filter => {
        let enum_value = "1";
        switch (filter) {
            case "NOT_EXIST":
              enum_value = "0";
              break;
            case "ACTIVE":
              enum_value = "1";
              break;
            case "INACTIVE":
               enum_value = "2";
              break;
          }
        const filteredProducts = [];

        if (contractData){
            contractData.forEach(product => {
                if (product.productStatus.toString() === enum_value) {
                    filteredProducts.push(product);
                }
            });
        } else {
            // console.log('No Data')
        }
        return filteredProducts
    }

    const getStockFilters = () => {
        let filters = [];
        if (contractData){
            contractData.forEach(product => {
                const status = product.stockStatus;
                const enum_value = getEnumForStock(status, 'value');
                if (!filters.includes(enum_value)) {
                    filters.push(enum_value);
                }
            });
        } else {
            // console.log('No Data')
        }
        return filters.sort();
    }

    // only owner to withdraw funds
    const withdrawFunds = async () => {
        activateSpinner()
        if (isOwnerState) {
            if (contractBalance > 0) {
                try {
                    const result = await ContractInstance.methods.withdraw(contractBalance).send({
                        from: userAddressState,
                        gas: 5500000
                    });
                    if ('WithdrawSuccessfull' in result.events) {
                        updateNotificationState(true, {
                          type: 'success',
                          title: 'success',
                          message: `Transaction Succeessfull. Transaction Hash: ${result.transactionHash}`
                        });
                        fetchContractBalance();
                    } else {
                        console.log(result);
                    }
                } catch(e){
                    if (e.message.includes("while formatting outputs from RPC \'")) {
                        updateNotificationState(true, {
                            type: 'error',
                            title: 'error',
                            message: formatException(e.message)
                        });
                    } else if (e.code === -32603) {
                        updateNotificationState(true, {
                            type: 'error',
                            title: 'error',
                            message: `It seems we ran out of gas. Please increase gas and try agian`
                        });
                    } else {
                        updateNotificationState(true, {
                            type: 'error',
                            title: 'error',
                            message: e.message
                        });
                    }
                }
            } else {
                updateNotificationState(true, {
                    type: 'error',
                    title: 'error',
                    message: `No balance in contract to withdraw`
                });
            }
        } else {
            updateNotificationState(true, {
                type: 'error',
                title: 'error',
                message: `Only Owner is allowed to execute this function`
            });
        }
        deactivateSpinner();
    }

    return (
        <ContractContext.Provider value={{
            contractData,
            contractBalance,
            getContractData,
            getFilteredProductsOnStock,
            getFilteredProductsOnStatus,
            getStockFilters,
            fetchContractBalance,
            withdrawFunds
        }}>
            {children}
        </ContractContext.Provider>
    )
}

export default ContractContext;