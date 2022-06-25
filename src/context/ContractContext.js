import  { createContext, useEffect, useState } from 'react';
import ContractInstance from '../ContractInstance';

const ContractContext = createContext();

export const ContractContextProvider = ({children}) => {
    const [contractData, setContractData] = useState(false)

    const getContractData = async () => {
        const data = await ContractInstance.methods.getAllProductIDToProductName().call();
        setContractData(data);
    }

    useEffect( () => {
        getContractData();
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
        contractData.forEach(product => {
            if (product.productStatus.toString() === enum_value) {
                filteredProducts.push(product);
            }
        });
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
        contractData.forEach(product => {
            if (product.productStatus.toString() === enum_value) {
                filteredProducts.push(product);
            }
        });
        return filteredProducts
    }

    const getStockFilters = () => {
        let filters = [];
        contractData.forEach(product => {
            const status = product.stockStatus;
            const enum_value = getEnumForStock(status, 'value');
            if (!filters.includes(enum_value)) {
                filters.push(enum_value);
            }
        });
        return filters.sort();
    }

    return (
        <ContractContext.Provider value={{
            contractData,
            setContractData,
            getFilteredProductsOnStock,
            getFilteredProductsOnStatus,
            getStockFilters
        }}>
            {children}
        </ContractContext.Provider>
    )
}

export default ContractContext;