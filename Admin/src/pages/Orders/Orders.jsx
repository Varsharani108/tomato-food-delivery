import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Orders.css";
import { assets } from "../../../../Frontend/src/assets/assets";

const Orders = ({ url }) => {

    const [orders, setOrders] = useState([]);

    // Fetch all orders
    const fetchAllOrders = async () => {
        try {

            const response = await axios.get(`${url}/api/order/list`);

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch orders");
        }
    };


    // Update order status
    const statusHandler = async (event, orderId) => {

        try {

            const response = await axios.post(
                `${url}/api/order/status`,
                {
                    orderId: orderId,
                    status: event.target.value
                }
            );

            if (response.data.success) {

                toast.success("Order status updated");

                await fetchAllOrders();

            } else {

                toast.error(response.data.message);

            }

        } catch (error) {

            console.log(error);
            toast.error("Something went wrong");

        }
    };


    useEffect(() => {
        fetchAllOrders();
    }, []);


    return (
        <div className="order add">

            <ToastContainer />

            <h3>Order Page</h3>

            <div className="order-list">

                {orders.map((order) => (

                    <div className="order-item" key={order._id}>
                      <img src={assets.parcel_icon}alt=""/>

                        <div className="order-info">

                            <p>
                                <strong>Order ID:</strong> {order._id}
                            </p>

                            <p>
                                <strong>User ID:</strong> {order.userId}
                            </p>

                            <p>
                                <strong>Amount:</strong> ₹{order.amount}
                            </p>

                            <p>
                                <strong>Payment:</strong>{" "}
                                {order.payment ? "Paid" : "Pending"}
                            </p>

                        </div>


                        <div className="order-items">

                            <h4>Items</h4>

                            {order.items.map((item, index) => (

                                <p key={index}>
                                    {item.name} × {item.quantity}
                                </p>

                            ))}

                        </div>


                        <div className="order-address">

                            <h4>Delivery Address</h4>

                            <p>
                                {order.address.firstName}{" "}
                                {order.address.lastName}
                            </p>

                            <p>{order.address.street}</p>

                            <p>
                                {order.address.city},{" "}
                                {order.address.state}
                            </p>

                            <p>{order.address.zipcode}</p>

                            <p>{order.address.country}</p>

                        </div>


                        <div className="order-status">

                            <select
                                value={order.status}
                                onChange={(event) =>
                                    statusHandler(event, order._id)
                                }
                            >

                                <option value="Food Processing">
                                    Food Processing
                                </option>

                                <option value="Out for delivery">
                                    Out for delivery
                                </option>

                                <option value="Delivered">
                                    Delivered
                                </option>

                            </select>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Orders;