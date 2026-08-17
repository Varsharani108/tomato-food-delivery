import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'

const PlaceOrder=()=> {
  const navigate = useNavigate();
  const {getTotalCartAmount,token,food_list,cartItems,url,user}=useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const [data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  // Pre-fill email from logged-in user
  useEffect(() => {
    if (user?.email) {
      setData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) =>{
    event.preventDefault();
    
    // Check if user is logged in
    if (!token) {
      alert("Please login to place an order");
      navigate("/");
      return;
    }
    
    // Validate email matches logged-in user
    if (data.email !== user?.email) {
      alert("Delivery email must match your account email");
      return;
    }
    
    // Check if cart is empty
    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty");
      return;
    }
    
    setIsLoading(true);
    try {
      let orderItems = [];
      food_list.map((item)=>{
        if(cartItems[item._id]>0){
          let itemInfo=item;
          itemInfo["quantity"]= cartItems[item._id];
          orderItems.push(itemInfo);
        }
      })
      let orderData ={
        address:data,
        items:orderItems,
        amount:getTotalCartAmount()+2,
      }
      let response = await axios.post(url+"/api/order/place", orderData, {
        headers: { token }
      })
      
      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <form onSubmit={placeOrder} className ='place-order'>
        <div className="place-order-left">
          <p className='title'>Delivery Information</p>

        
        <div className="multi-field">
          <input required  name='firstName' onChange={onChangeHandler} value={data.firstName}type="text" placeholder='First name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName}type="text" placeholder='Last name'/>

        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address' readOnly/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
        <div className="multi-field">
          <input required name='city' onChange={onChangeHandler} value={data.city}type='text'placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state}type="text"placeholder='State'/>
        </div>
        <div className="multi-field">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode}type='text'placeholder='Zip code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country}type="text"placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone}type='text'placeholder='phone'/>
        </div>
        <div className="place-order-right">
          <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                 <p>Delivery Fee</p>
                 <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr></hr>
            <div className="cart-total-details">
                 <p>Total</p>
                 <p>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</p>
            </div>
          </div>
          <button type="submit" disabled={isLoading || !token || getTotalCartAmount()===0}>
            {isLoading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
        </div>
      </form>
    
  )
}

export default PlaceOrder