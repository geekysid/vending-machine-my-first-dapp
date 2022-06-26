import React, { useContext } from 'react';
import ContractContext from '../context/ContractContext.js';
import ContractInstance from '../ContractInstance.js';
import ShowProducts from './ShowProducts';
import AddProducts from './AddProducts';

const Admin = () => {
  return (
    <>
      <AddProducts />
      <hr width="100%"/>
      <ShowProducts />
    </>
  )
}

export default Admin