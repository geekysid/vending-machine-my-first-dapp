import React from 'react'
import { SpinnerCircular } from 'spinners-react';

const Spinner = () => {
  return (
    <div className="spinner">
        <SpinnerCircular enabled={true} size={75} color={"#f87272"} />
    </div>
  )
}

export default Spinner