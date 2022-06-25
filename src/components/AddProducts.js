import React, {useState, useContext} from 'react'
import ContractInstance from '../ContractInstance';
import UserContext from '../context/userContext';
import ContractContext from '../context/ContractContext';
import web3 from 'web3';

const AddProducts = () => {
    const [ productData, setProductData ] = useState({
        title: "",
        price: "",
        stock: ""
    });

    const {userAddressState} = useContext(UserContext);
    const {contractData, setContractData} = useContext(ContractContext);

    //  making sure stock is a positive number
    const validatePrice = event => {
        if (isNaN(parseFloat(event.target.value)) || parseFloat(event.target.value) <= 0) {
            event.target.value = 0;
            alert(`${event.target.name.toUpperCase()} has to be Number greater than 0`)
            return 0;
        } else {
            return parseFloat(event.target.value);
        }
    }

    //  making sure stock is an positive integer
    const validateStock = event => {
        if (!Number.isInteger(parseFloat(event.target.value)) || parseInt(event.target.value) < 1) {
            event.target.value = 0;
            alert(`${event.target.name.toUpperCase()} has to be an Integer`)
            return 0;
        } else {
            return parseInt(event.target.value);
        }
    }

    // event call when any change in input fields
    const handelChange = event => {
        let value = event.target.value;
        if (event.target.name === "price") {
            value = validatePrice(event);
        } else if (event.target.name === "stock") {
            value = validateStock(event);
        }
        setProductData(prevState => {
            return {
                ...prevState,
                [event.target.name]: value
            }
        })
    }

    // adding product to blockchain
    const addProduct = async () => {
        const title = document.getElementById('input-title').value;
        const price = parseFloat(document.getElementById('input-price').value);
        const stock = parseFloat(document.getElementById('input-stock').value);

        if (title && price && stock) {
            try {
                const result = await ContractInstance.methods.addNewProduct(title, web3.utils.toWei(price.toString(), 'ether'), stock, stock).send({
                    from: userAddressState,
                    gas: 5500000
                });
                console.log(JSON.stringify(result))
                if ('ProductAdded' in result.events) {
                    console.log({
                        blockNumber: result.events.ProductAdded.blockNumber,
                        transactionHash: result.events.ProductAdded.transactionHash,
                        mined: result.events.ProductAdded.mined,
                        productID: result.events.ProductAdded.returnValues.productID,
                        productName: result.events.ProductAdded.returnValues.productName
                    })
                    setContractData();
                }
            } catch(e) {
                if (e.code === -32603) console.log("Out of Gas")
                else if (e.code === 4001) console.log("Rejected by user in Metamask")
                else console.log(e)
            }


        } else {
            alert('Please input all values');
        }
    }

    return (
        <div className="vending--section">
            <h4 className="vending--section--heading">Add Proucts</h4>
            <div className="vending--section--row--add-item">
                <div className="vending--section--row--img">
                    <input type="file" accept="image/*" />
                    <div className="vending--section--row--buyBtn smallest-font" onClick={() => document.getElementById('uploadIconBtn').click()} >
                        Upload Icon
                    </div>
                    <input type="file" accept="image/*" id="uploadIconBtn" name="uploadIconBtn"/>

                </div>
                <div className="vending--section--row--title">
                    <input value={productData.title} type="text" placeholder="enter product descp" name="title" id="input-title" onChange={event => handelChange(event)}/>
                </div>
                <div className="vending--section--row--price">
                    <input value={productData.price} type="number" placeholder="price" name="price" id="input-price" size="5" min="0" onChange={event => handelChange(event)}/>
                </div>
                <div className="vending--section--row--input">
                    <input value={productData.stock} type="number" name="stock" id="input-stock" size="5" min="0" max="5" placeholder="stock" onChange={event => handelChange(event)}/>
                </div>
                <div className="vending--section--row--buyBtn" onClick={addProduct}>
                    <span>Add</span>
                </div>
            </div>
        </div>
    )
}

export default AddProducts