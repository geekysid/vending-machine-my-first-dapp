const fs = require('fs-extra');

const VendingMachine = artifacts.require("VendingMachine");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(VendingMachine);
  fs.writeFileSync(`./ContractAddress_${network}.js`, `export const VendingMachineContractAddress = "${VendingMachine.address}";
export const OwnerAddress = "${accounts[0]}";
export const Network = "${network}";`);
};
