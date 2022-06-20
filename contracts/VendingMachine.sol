// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Strings.sol";

contract VendingMachine {

    struct Product {
        string productName;
        uint256 productID;
        uint256 price;
        uint256 balance;
        uint256 capacity;
        StockStatus stockStatus;
        ProductStatus productStatus;
    }

    enum StockStatus { OVERFLOW, FULL, OK, LOW, OUT_OF_STOCK }
    enum ProductStatus { NOT_EXIST, ACTIVE, INACTIVE }
    mapping(uint256 => Product) product;
    uint256[] product_list;
    address immutable owner;

    constructor () {
        owner = msg.sender;
    }

    event ProductAdded (uint256 productID, string productName, uint256 balance, uint256 price, StockStatus currentStockStatus);
    event ProductUpdated (uint256 productID, uint256 capacity, uint256 price, StockStatus currentStockStatus);
    event ProductReStocked (uint256 productID, uint256 quantityAdded, uint256 newBalance, StockStatus currentStockStatus);
    event WithdrawSuccessfull(address account, uint256 _amount);

    // Modifier: making sure only Owner has acces
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can access this functionality");
        _;
    }

    // Modifier: making sure that product is not part of product_list
    modifier productNotExists(string memory _productName) {
        require(!productExists__name(_productName), "Product already exist by this name");
        _;
    }

    // Modifier: making sure product exists
    modifier productExists(uint256 _productID){
        require(product[_productID].productStatus != ProductStatus.NOT_EXIST, "Product doesnot exists");
        _;
    }

    // Modifier: making sure that product is available
    modifier productIsInStock(uint256 _productID, uint256 _quantityRequired) {
        require(product[_productID].stockStatus != StockStatus.OUT_OF_STOCK, "Product is out of stock");
        _;
    }

    // Modifier: making sure that product is available
    modifier productQuantityIsAvailable(uint256 _productID, uint256 _quantityRequired) {
        require(product[_productID].balance >= _quantityRequired, string.concat("Product is a bit low in stock. Only ", Strings.toString(product[_productID].balance), " is avalable."));
        _;
    }

    // UTILITY Function to check if product exist with given name
    function productExists__name(string memory _productName) internal view returns (bool){
        bool _productExists;
        for( uint256 i=0; i<product_list.length; i++ ){
            if (keccak256(abi.encodePacked(product[product_list[i]].productName)) == keccak256(abi.encodePacked(_productName))) {
                _productExists = true;
                break;
            }
        }
        return _productExists;
    }

    // UTILITY function to check status of stock
    function getStockStatus(uint256 _currentStock, uint256 _capacity) internal pure returns (StockStatus currentStockStatus) {
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

    // Function to allow owner to ad new products to the machine
    function addNewProduct(string memory _name, uint256 _price, uint256 _balance, uint256 _capacity) external onlyOwner productNotExists(_name) {
        uint256 _productID = product_list.length;
        product_list.push(_productID);
        Product storage _product = product[_productID];
        _product.productName = _name;
        _product.productID = _productID;
        _product.price = _price;
        _product.balance = _balance;
        _product.capacity = _capacity;
        _product.productStatus = ProductStatus.ACTIVE;
        _product.stockStatus = getStockStatus(_balance, _capacity);
        emit ProductAdded(_product.productID, _product.productName , _product.balance, _product.price , product[_productID].stockStatus);
    }

    // Function to allow owner to ad new products to the machine
    function editProduct(uint256 _productID, uint256 _price, uint256 _capacity) external onlyOwner productExists(_productID) {
        Product storage _product = product[_productID];
        _product.price = _price;
        if (_capacity != _product.capacity){
            _product.capacity = _capacity;
            _product.stockStatus = getStockStatus(_product.balance, _capacity);
        }
        emit ProductUpdated(_product.productID, _product.balance, _product.price , product[_productID].stockStatus);
    }

    // Function to allow owner to restock a given products
    function reStock(uint256 _productID, uint256 _quantityToAdd) external onlyOwner productExists(_productID) {
        // making sure we dont over stock a product
        if (product[_productID].balance + _quantityToAdd <= product[_productID].capacity) {
            product[_productID].balance += _quantityToAdd;          // adding new stock to old stock
            product[_productID].stockStatus = getStockStatus(product[_productID].balance, product[_productID].capacity);        // updating stoock status
            emit ProductReStocked(_productID, _quantityToAdd, product[_productID].balance, product[_productID].stockStatus);
        } else {
            revert(string.concat("You can't add more than its capacity. Max allowed to add: ", Strings.toString(product[_productID].capacity-product[_productID].balance)));
        }
    }

    // Function to allow owner to ad new products to the machine
    function updateProductStatus(uint256 _productID, ProductStatus _productStatus) external onlyOwner productExists(_productID) {
        Product storage _product = product[_productID];
        _product.productStatus = _productStatus;
        emit ProductAdded(_product.productID, _product.productName , _product.balance, _product.price , product[_productID].stockStatus);
    }

    // Funtion to allow owner to withdraw funds
    function withdraw(uint256 _amount) external onlyOwner  {
        require(address(this).balance >= (_amount * 1 ether), "Not enough balance to withdraw");
        (bool _success, ) = msg.sender.call{value: _amount * 1 ether}("");
        if (_success) {
            emit WithdrawSuccessfull(msg.sender, _amount);
        } else{
            revert ("Unable to sent transaction because of some reason.");
        }
    }

    // Function to get product by ID
    function getProduct(uint256 _productID) external view productExists(_productID) returns (Product memory) {
        return product[_productID];
    }

    // Function to get all products ID
    function getAllProductIDs() external view returns (uint256[] memory) {
        return product_list;
    }

    // Function to get all products
    function getAllProductIDToProductName() external view returns (Product[] memory) {
        Product[] memory _products = new Product[](product_list.length);
        for (uint256 i; i<product_list.length; i++) {
            _products[i] = product[product_list[i]];
        }
        return _products;
    }
}