import React, { useContext } from 'react';
import ContractContext from '../context/ContractContext';
import web3 from 'web3';

const Withdraw = () => {
    const { contractBalance, fetchContractBalance, withdrawFunds } = useContext(ContractContext);

    const getBalance = parseFloat(web3.utils.fromWei(contractBalance.toString(), 'ether')).toFixed(4);

    return (
        <div className="shop--section">
            <div className="shop--section--withdrawal">
                <div className="shop--section--withdrawal--text">
                    <strong>Contract Balance</strong>: {getBalance} Eth
                </div>
                <div className="shop--section--withdrawal--btn">
                    <div className="shop--section--withdrawal--btn-btn" onClick={fetchContractBalance} >
                        Update
                    </div>
                </div>
                <div className="shop--section--withdrawal--btn">
                    <div className="shop--section--withdrawal--btn-btn" onClick={withdrawFunds} >
                        Withdraw
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Withdraw