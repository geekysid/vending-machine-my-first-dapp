import React, { useState, useContext, useEffect } from 'react';
import ContractContext from '../context/ContractContext';
import UserContext from '../context/userContext';
import ContractInstance from '../ContractInstance';
import web3 from 'web3';
import { formatException } from '../utils';
import SpinnerContext from '../context/SpinnerContext';
import NotificationContext from '../context/NotificationContext';
const IpfsHttpClient = require("ipfs-http-client");

const ShowProducts = () => {
  const [productsState, setProductsState] = useState([]);
  const { contractData, getFilteredProductsOnStock, getFilteredProductsOnStatus, getStockFilters, getContractData } = useContext(ContractContext);
  const { userAddressState, isOwnerState } = useContext(UserContext);
  const { activateClick, deactivateClick} = useContext(SpinnerContext);
  const { updateNotificationState } = useContext(NotificationContext);

  useEffect(() => {
    const activeProduct = getFilteredProductsOnStatus(contractData)
    getProductList(activeProduct);
  },[contractData])

  // updating state of the product
  const updateProductState = (products) => {
    setProductsState(products);
  }

  // function for user to allow buy product
  const buyProduct = async (productID, event) => {
    let orderedProduct = contractData.filter(product => {
      return product.productID === productID;
    });
    orderedProduct = orderedProduct[0]

    // making sure product is in stock and also active
    if (orderedProduct.stockStatus === "4") {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `This product is Out of Stock currently`
      });
      return false
    } else if (orderedProduct.productStatus != "1") {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `This product is not available currently.`
      });
      return false
    } else {
      console.log("Stock and Statue: Good to Go")
    }

    // making sure quantity is true
    const qty = document.getElementById(`product-${productID}-qty`).value
    if (!Number.isInteger(parseFloat(qty)) || parseInt(qty) <= 0) {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `Quantity has to be an Integer greater than 0`
      });
      return false
    } else if (parseInt(qty) > orderedProduct.balance) {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `Only ${orderedProduct.balance} available for purchase.`
      });
      return false
    } else {
      console.log("Quantity: Good to Go")
    }

    const totalCost = orderedProduct.price * qty;
    deactivateClick(event.target.parentElement);
    try {
      const result = await ContractInstance.methods.purchase(productID, qty).send({
        from: userAddressState,
        gas: 5500000,
        value: totalCost
      })
      console.log('Purchased' in result.events)
      if ('Purchased' in result.events) {
        updateNotificationState(true, {
          type: 'success',
          title: 'success',
          message: `Transaction Succeessfull. Transaction Hash: ${result.transactionHash}`
        });
        getContractData();
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
      } else {
        updateNotificationState(true, {
          type: 'error',
          title: 'error',
          message: e.message
        });
      }
    }
    activateClick(event.target.parentElement);
  }

  // function for owner to allow restock product
  const restockProduct = async (productID, event) => {
    let orderedProduct = contractData.filter(product => {
      return product.productID === productID;
    });
    orderedProduct = orderedProduct[0]

    // making sure product is in stock and also active
    if (orderedProduct.stockStatus === "1" || orderedProduct.stockStatus === "0") {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `This product already has full stock`
      });
      return false
    }

    // making sure quantity is true
    const qty = document.getElementById(`product-${productID}-qty`).value
    if (!Number.isInteger(parseFloat(qty)) || parseInt(qty) <= 0) {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `Quantity has to be an Integer greater than 0`
      });
      return false
    } else if (parseInt(qty) > orderedProduct.capacity-orderedProduct.balance) {
      updateNotificationState(true, {
        type: 'error',
        title: 'error',
        message: `Product max capacity is ${orderedProduct.capacity}. So you can add maximum of ${orderedProduct.capacity-orderedProduct.balance} to current stock. `
      });
      return false
    }

    deactivateClick(event.target.parentElement);
    try {
      const result = await ContractInstance.methods.reStock(productID, qty).send({
        from: userAddressState,
        gas: 5500000
      })
      console.log('ProductReStocked' in result.events)
      if ('ProductReStocked' in result.events) {
        updateNotificationState(true, {
          type: 'success',
          title: 'success',
          message: `Transaction Succeessfull. Transaction Hash: ${result.transactionHash}`
        });
        getContractData();
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
      } else {
        updateNotificationState(true, {
          type: 'error',
          title: 'error',
          message: e.message
        });
      }
    }
    activateClick(event.target.parentElement);
  }

  // get image from IPFS
  const getImageIPFSAsync = async (cid) => {
    const ipfs = IpfsHttpClient('https://ipfs.infura.io:5001/api/v0')
    if (cid === "") {
      return '/images/drinks.png'
    } else {
      const exists = (await ipfs.get(cid)).next() !== null;
      if (exists) {
        return `https://ipfs.infura.io/ipfs/${cid}`
      } else {
        return '/images/drinks.png'
      }
    }
  }

  // get IPFS image Hash
  const getImageIPFS = cid => {
    if (cid === "") {
      return '/images/drinks.png'
    } else {
        return `https://ipfs.infura.io/ipfs/${cid}`
    }
  }

  // function to generate product DOM
  const getProductList = products => {

    const productList = products.map((product, index) => {
      return (
      <div className="vending--section--row" id={product.productID} key={index}>
        <div className="vending--section--row--img">
          <img src={getImageIPFS(product.imageHash)} alt="" />
        </div>
        <div className="vending--section--row--title">
          <span>{product.productName}</span>
        </div>
        <div className="vending--section--row--price">
          <span>{web3.utils.fromWei(product.price.toString(), 'ether')}</span>
        </div>
        <div className="vending--section--row--input" style={(!isOwnerState && product.balance == 0) || (isOwnerState && product.stockStatus == 1) ? {pointerEvents:"none"} : {} } >
          <input
              id={`product-${product.productID}-qty`}
              type="number"
              name="quatity"
              size="3"
              min="0"
              max={ isOwnerState ? product.capacity - product.balance : product.balance }
              // onChange={ event => qntyChangeHandle(event, product.productID) }
              placeholder={ isOwnerState ? product.capacity - product.balance : product.balance }
          />
        </div>
        <div className="vending--section--row--buyBtn"
            style={(!isOwnerState && product.balance == 0) || (isOwnerState && product.stockStatus == 1) ? {pointerEvents:"none"} : {} }
            onClick={isOwnerState ? event => restockProduct(product.productID, event) : event => buyProduct(product.productID, event) }
        >
          {
            isOwnerState
            ?
            <span>{ product.stockStatus === "1" ? "Full" : "Restock" }</span>
            :
            <span>{ product.stockStatus === "4" ? "N/A" :  "Buy" }</span>
          }
        </div>
      </div>
    )});
    updateProductState(productList);
  }

  // function to get filtered products
  const getFilterProducts = (event, filter) => {
    deactivateClick(event.target)
    const products = getFilteredProductsOnStock(filter);
    activateClick(event.target)
    return getProductList(products);
  }

  // funtion to setup filters for owner
  const setupFilters = () => {
    const products = getStockFilters().map((item, index) => {
        return (
          <div className="vending--section--filters--item" key={index} onClick={event => getFilterProducts(event, item)}>
              {item}
          </div>
        )
    });
    return products;
  }

  return (
    <div className="shop--section">
      {
        isOwnerState
        &&
        <div className="vending--section--filters">
          {  setupFilters() }
        </div>
      }
      {
        productsState
      }
    </div>
  )
}

export default ShowProducts