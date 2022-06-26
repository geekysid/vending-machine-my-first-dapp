// SPDX-License-Identifier: MIT

/**************************************
    @title Vending Machine Silmuator
    @author Siddhant Shah
    @date June 20 2022
***************************************/

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Strings.sol";

contract VendingMachine {

    // Product Object
    struct Product {
        string imageHash;                   // hash of product's image loaded on IPFS
        string productName;                 // name of product
        uint256 productID;                  // ID of product
        uint256 price;                      // price of product
        uint256 balance;                    // quantity remaining in vending machine
        uint256 capacity;                   // maximum capacity of vending machine for this product
        StockStatus stockStatus;            // status of product's stock in vending machine
        ProductStatus productStatus;        // product's availability status
    }

    enum StockStatus { OVERFLOW, FULL, OK, LOW, OUT_OF_STOCK }      // product's stock option
    enum ProductStatus { NOT_EXIST, ACTIVE, INACTIVE }              // product's availability option
    mapping(uint256 => Product) product;                // mapping of product's id to product itself
    uint256[] productIDs;                               // list of all product's IDs
    address immutable owner;                            // owner of vending machine

    constructor () {
        owner = msg.sender;
    }

    // EVENT Definitions
    event ProductAdded (
        uint256 productID,
        string productName,
        uint256 balance,
        uint256 price,
        StockStatus currentStockStatus
    );              // event to to emited when owner successfully add new product to vending

    event ProductUpdated (
        uint256 productID,
        uint256 capacity,
        uint256 price,
        StockStatus currentStockStatus
    );              // event to to emited when owner successfully updates a product's data

    event ProductReStocked (
        uint256 productID,
        uint256 quantityAdded,
        uint256 newBalance,
        StockStatus currentStockStatus
    );              // event to to emited when owner successfully add more quantity of a product

    event WithdrawSuccessfull(
        address account,
        uint256 amount
    );              // event to to emited when owner successfully withdraws from contract

    event Purchased(
        uint256 product_id,
        uint256 quantity
    );              // event to to emited when someone successfully purchases from vending machine

    /* @title MODIFIER to ensure only Owner has acces */
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can access this functionality");
        _;
    }

    /* @title MODIFIER to ensure that product is not part of productIDs */
    modifier productNotExists(string memory _productName) {
        require(!productExists__name(_productName), "Product already exist by this name");
        _;
    }

    /* @title MODIFIER to ensure product exists */
    modifier productExists(uint256 _productID){
        require(
            product[_productID].productStatus != ProductStatus.NOT_EXIST,
            "Product doesnot exists");
        _;
    }

    /* @title MODIFIER to ensure that product is available */
    modifier productIsActive(uint256 _productID) {
        require(
            product[_productID].productStatus == ProductStatus.ACTIVE,
            "Owner has deactivate sale of this product. Please try another one"
        );
        _;
    }

    /* @title MODIFIER to ensure that product is available */
    modifier productIsInStock(uint256 _productID, uint256 _quantityRequired) {
        require(
            product[_productID].stockStatus != StockStatus.OUT_OF_STOCK,
            "Product is out of stock"
        );
        _;
    }

    /* @title MODIFIER to ensure that product's minimum quantity is available */
    modifier productQuantityIsAvailable(uint256 _productID, uint256 _quantityRequired) {
        require(
            product[_productID].balance >= _quantityRequired,
            string.concat("Product is a bit low in stock. Only ",
                Strings.toString(product[_productID].balance),
                " is avalable."
            )
        );
        _;
    }

    /**
        * @dev UTILITY FUNCTION to check if product exist with given name
        * @param _productName String:  Name of product
        * @return bool
    */
    function productExists__name(string memory _productName) internal view returns (bool){
        bool _productExists;
        for( uint256 i=0; i<productIDs.length; i++ ){
            if (keccak256(abi.encodePacked(product[productIDs[i]].productName)) == keccak256(abi.encodePacked(_productName))) {
                _productExists = true;
                break;
            }
        }
        return _productExists;
    }

    /**
        * @dev UTILITY FUNCTION to check status of stock
        * @param _currentStock uint256 current stock of product
        * @param _capacity uint256 maximum capacity of stock of product
        * @return currentStockStatus StockStatus status of stock
    */
    function getStockStatus(uint256 _currentStock, uint256 _capacity) internal pure
            returns (StockStatus currentStockStatus) {
        if (_currentStock == _capacity) {
            currentStockStatus = StockStatus.FULL;
        } else if (_currentStock > _capacity) {
            currentStockStatus = StockStatus.OVERFLOW;
        } else if (_currentStock == 0) {
            currentStockStatus = StockStatus.OUT_OF_STOCK;
        } else if (_currentStock >= _capacity/2) {
            currentStockStatus = StockStatus.OK;
        } else if (_currentStock <= _capacity/2) {
            currentStockStatus = StockStatus.LOW;
        }
    }

    /**
        * @dev FUNCTION to allow owner to ad new products to the machine
        * @param _name string name of product
        * @param _price uint256 price of product
        * @param _balance uint256 current stock of product
        * @param _capacity uint256 maximum capacity of stock of product
    */
    function addNewProduct(string memory _imageHash, string memory _name, uint256 _price, uint256 _balance, uint256 _capacity)
            external onlyOwner productNotExists(_name) {
        uint256 _productID = productIDs.length;                 // get a new productID
        productIDs.push(_productID);                            // add productID to list of array that contains all array
        Product storage _product = product[_productID];         // get a new product
        _product.imageHash = _imageHash;
        _product.productName = _name;
        _product.productID = _productID;
        _product.price = _price;
        _product.balance = _balance;
        _product.capacity = _capacity;
        _product.productStatus = ProductStatus.ACTIVE;
        _product.stockStatus = getStockStatus(_balance, _capacity);

        // emit an event
        emit ProductAdded(
            _product.productID,
            _product.productName ,
            _product.balance,
            _product.price ,
            product[_productID].stockStatus
        );
    }

    /**
        * @dev FUNCTION to allow owner to ad new products to the machine
        * @param _productID uint256 ID of product
        * @param _price uint256 new price of product
        * @param _capacity uint256 new maximum capacity of stock of product
    */
    function editProduct(uint256 _productID, uint256 _price, uint256 _capacity) external onlyOwner productExists(_productID) {
        Product storage _product = product[_productID];         // get product which needs to be updated
        _product.price = _price;

        //  if capacity is changed that only go ahead
        if (_capacity != _product.capacity){
            _product.capacity = _capacity;
            _product.stockStatus = getStockStatus(_product.balance, _capacity);
        }

        // emit event
        emit ProductUpdated(
            _product.productID,
            _product.balance,
            _product.price ,
            product[_productID].stockStatus
        );
    }

    /**
        * @dev FUNCTION to allow owner to restock a given products
        * @param _productID uint256 ID of product
        * @param _quantityToAdd uint256 total quantity that needsto be added to stock
    */
    function reStock(uint256 _productID, uint256 _quantityToAdd) external onlyOwner productExists(_productID) {
        // ensure we dont over stock a product
        if (product[_productID].balance + _quantityToAdd <= product[_productID].capacity) {
            product[_productID].balance += _quantityToAdd;          // adding new stock to old stock
            product[_productID].stockStatus = getStockStatus(
                                                product[_productID].balance,
                                                product[_productID].capacity
                                              );        // updating stoock status
            // emiting event
            emit ProductReStocked(
                _productID,
                _quantityToAdd,
                product[_productID].balance,
                product[_productID].stockStatus
            );
        } else {
            revert(
                string.concat("You can't add more than its capacity. Max allowed to add: ",
                Strings.toString(product[_productID].capacity-product[_productID].balance))
            );
        }
    }

    /**
        * @dev FUNCTION to allow owner to update existing product's status to the machine
        * @param _productID uint256 ID of product
        * @param _productStatus ProductStatus total quantity that needsto be added to stock
    */
    function updateProductStatus(uint256 _productID, ProductStatus _productStatus) external onlyOwner productExists(_productID) {
        Product storage _product = product[_productID];  // getting product thats needs to be updated
        _product.productStatus = _productStatus;         // setting status

        // emiting event
        emit ProductAdded(
            _product.productID,
            _product.productName ,
            _product.balance,
            _product.price ,
            product[_productID].stockStatus
        );
    }

    /**
        * @dev FUNCTION to allow owner to withdraw funds
        * @param _amount uint256 amount that owner wishes to withdraw
    */
    function withdraw(uint256 _amount) external onlyOwner  {
        require(address(this).balance >= _amount, "Not enough balance to withdraw");
        (bool _success, ) = payable(msg.sender).call{value: _amount}("");     // transfering funds

        //  if transfer succeed
        if (_success) {
            emit WithdrawSuccessfull(msg.sender, _amount);      // emit event
        } else{
            revert ("Unable to sent transaction because of some reason.");
        }
    }

    /**
        * @dev FUNCTION to allow user to buy a product
        * @param _productID uint256 ID of product
        * @param _quantity uint256 quantity purchased
    */
    function purchase(uint256 _productID, uint256 _quantity) payable external productExists(_productID)
        productIsActive(_productID) productIsInStock(_productID, _quantity) productQuantityIsAvailable(_productID, _quantity) 
    {
        uint256 _totalPrice = product[_productID].price * _quantity;      // total price of transaction
        require(
            msg.value >= _totalPrice,
            string.concat("Need a minmum of ", Strings.toString(_totalPrice), "WEI to purchase.")
        );
        product[_productID].balance -= _quantity;           // reduce the quantiity
        product[_productID].stockStatus = getStockStatus(
                                            product[_productID].balance,
                                            product[_productID].capacity
                                        );                  // updating stock status
        // emiting event
        emit Purchased(_productID, _quantity);
    }

    /**
        * @dev FUNCTION to get product by ID
        * @param _productID uint256 ID of product
        * @return _product Product
    */
    // Function to get product by ID
    function getProduct(uint256 _productID) external view productExists(_productID) returns (Product memory) {
        return product[_productID];
    }

    /**
        * @dev FUNCTION to get all products ID
        * @return _products Product[] array of all products ID
    */
    function getAllProductIDs() external view returns (uint256[] memory) {
        return productIDs;
    }

    /**
        * @dev FUNCTION to get all products
        * @return _products Product[] array of all products
    */
    function getAllProductIDToProductName() external view returns (Product[] memory) {
        Product[] memory _products = new Product[](productIDs.length);
            for (uint256 i; i<productIDs.length; i++) {
            _products[i] = product[productIDs[i]];
        }
        return _products;
    }

    /**
        * @dev FUNCTION to allow owner to get balance of contract
        * @return _balance uint256 balance of contract
    */
    function getContractBalance() external onlyOwner view returns (uint256) {
        return address(this).balance;
    }
}