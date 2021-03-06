import { Web3Instance } from './Web3Instance';
import { VendingMachineContractAddress } from './ContractAddress_local';
import {ABI} from './VendingMachineABI';

const ContractInstance = new Web3Instance.eth.Contract(JSON.parse(ABI), VendingMachineContractAddress);

export default ContractInstance;