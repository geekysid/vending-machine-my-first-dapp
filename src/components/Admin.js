import React from 'react';
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