"use-strict";

const solc = require('solc');       // solidity compiler
const fs = require('fs-extra');     // file system library with some extra features
const path = require('path');
const ProjectContract = ['VendingMachine']

// reading imported openzepplin code
const OpenzepplinStringsCode = fs.readFileSync("./node_modules/@openzeppelin/contracts/utils/Strings.sol");

// path to where compiled files will be stored
const buildPath = path.resolve(__dirname, 'build');
// // removing build folder if exists before building
// fs.remove(buildPath);

// saving json to src folder
const saveABItoSrc = (contract, compiledContract) => {
    const AbiFilePath = path.resolve(__dirname, 'src');
    fs.ensureDir(AbiFilePath);

    fs.writeFileSync(
        path.resolve(AbiFilePath, `${contract}ABI.js`),
        `export const ABI = '${JSON.stringify(compiledContract["abi"])}';`);

    console.log(`ABI saved to ${AbiFilePath}`);
}

const compileContract = contractFile =>  {
    // path to smarth contract file
    const contractFilePath = path.resolve(__dirname, 'contracts', contractFile);
    // reading contract file as a text
    const contractSourceCode = fs.readFileSync(contractFilePath, 'utf8');

    // input to the solidity compiler
    const input = {
        language: 'Solidity',
        sources: {
            contractFile : {
                content: contractSourceCode
            }
        },
        settings: {
            outputSelection: {
            '*': {
                    '*': [ '*' ]
                }
            }
        }
    };

    // path of node-mudule folder for all imported libraries
    function findImports(path) {
        if (path === "@openzeppelin/contracts/utils/Strings.sol") return { contents: `${OpenzepplinStringsCode}` };
        else return { error: "File not found" };
    }

    // compiling contract
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    // extract required compiled data
    const contractVendingMachine = compiledContract['contracts']['contractFile'];
    // // Saves entire compiled data to a file in root directory
    // fs.outputJSONSync(
    //     path.resolve(__dirname, `compiledContract.json`),
    //     contractVendingMachine
    // );

    // creating build path to ensure it exists
    fs.ensureDir(buildPath);

    // saving extracted data to json file
    for (let contract in contractVendingMachine) {
        // // saves all caontract's abi to build folder
        // fs.outputJSONSync(
        //     path.resolve(buildPath, `${contract}.json`),
        //     contractVendingMachine[contract]
        // )

        // saving only required contract's abi to build folder and src folder
        if (contract === ProjectContract[0]) {
            fs.outputJSONSync(
                path.resolve(buildPath, `${contract}.json`),
                contractVendingMachine[contract]
            )
            saveABItoSrc(contract, contractVendingMachine[contract])
        }
    }

}

compileContract('VendingMachine.sol');