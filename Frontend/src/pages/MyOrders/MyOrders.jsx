import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          url + "/api/order/userorders",
          {},
          {
            headers: { token }
          }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [url, token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      
      {loading ? (
        <p className='loading'>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className='no-orders'>No orders found</p>
      ) : (
        <div className='container'>
          {orders.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="parcel" />
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p className='dot'><span>●</span><b>{order.status}</b></p>
              <button>Track Order</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders