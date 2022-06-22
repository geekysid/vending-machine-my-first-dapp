require('dotenv').config();       // to read .env files
const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');       // web3 library
const HDWalletProvider = require('@truffle/hdwallet-provider');     // truffle hd wallet library

// setting up web3 instance
const getWeb3Instance = network => {
    let web3;
    if (network === "local") {
        web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
    } else if (network === "rinkeby") {
        web3 = new Web3(new HDWalletProvider(
            process.env.REACT_APP_RINKEBY_MNEMONICS,
            process.env.REACT_APP_RINKEBY_INFURA_ID
        ));
    }
    return web3;
}
// function to get ABI and Bytecode for a given contract
const getCompiledData = contract => {
    const compiledContractFile = path.resolve(__dirname, 'build', `${contract}.json`);
    if (fs.existsSync(compiledContractFile)) {
        const compiledData = JSON.parse(fs.readFileSync(compiledContractFile, 'utf-8'));
        const abi = compiledData['abi']
        const bytecode = compiledData['evm']['bytecode']['object'];
        return {abi, bytecode};
    } else {
        console.log(`No file exists: ${compiledContractFile}`);
        return {abi: null, bytecode: null};
    };
}

// deploy a given contract
const deploy = async (contract, network) => {
    const web3 = getWeb3Instance(network);                      // settingup web3 instance
    const { abi, bytecode } = getCompiledData(contract);        // getting ABI and ByteCode for a given contract

    if (web3 && abi && bytecode) {
        const contract = new web3.eth.Contract(abi);          // creating contract instance using ABI
        const accounts = await web3.eth.getAccounts();              // getting all avilable accounts
        console.log(`-------- Staring to deploye contract`);
        const deployedContract = await contract.deploy({            // deploying contract
            arguments: [],
            data: bytecode
        })
        .send({ from: accounts[0], gas: 5500000});
        console.log(`-------- Contract Deployed`);

        const contractAddress = deployedContract.options.address;

        fs.writeFileSync(
            `ContractAddress-script--${network}.js`,
            `export const ContractAddress = "${contractAddress}"
export const OwnerAddress = "${accounts[0]}"`
        );
    } else {
        console.log("Something went wrong while fetching Either of Web3, ABI or ByteCode.")
    }
}

deploy('VendingMachine', 'rinkeby')