"use-strict";

const solc = require('solc');       // solidity compiler
const fs = require('fs-extra');     // file system library with some extra features
const path = require('path');


// reading imported openzepplin code
const OpenzepplinStringsCode = fs.readFileSync("./node_modules/@openzeppelin/contracts/utils/Strings.sol");

// path to where compiled files will be stored
const buildPath = path.resolve(__dirname, 'build');
// // removing build folder if exists before building
// fs.remove(buildPath);

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

    function findImports(path) {
        if (path === "@openzeppelin/contracts/utils/Strings.sol") return { contents: `${OpenzepplinStringsCode}` };
        else return { error: "File not found" };
      }

    // compiling contract
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    // fs.outputJSONSync(
    //     path.resolve(__dirname, `compiledContract.json`),
    //     compiledContract
    // );

    // extract required compiled data
    const contractVendingMachine = compiledContract['contracts']['contractFile'];
    fs.outputJSONSync(
        path.resolve(__dirname, `compiledContract.json`),
        contractVendingMachine
    );

    // creating build path to ensure it exists
    fs.ensureDir(buildPath);

    // saving extracted data to json file
    for (let contract in contractVendingMachine) {
        fs.outputJSONSync(
            path.resolve(buildPath, `${contract}.json`),
            contractVendingMachine[contract]
        )
    }

}

compileContract('VendingMachine.sol');