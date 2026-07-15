import React from 'react'
import './PlaceOrder.css'

function PlaceOrder() {
  return (
    <div>
      <form className ='place-order'>
        <div className="place-order-left">
          <p className='title'>Delivery Information</p>

        </div>
        <div className="multi-field">
          <input type="text" placeholder='First name'/>
          <input type="text" placeholder='Last name'/>

        </div>
        <div className="place-order-right">

        </div>
      </form>
    </div>
  )
}

export default PlaceOrder