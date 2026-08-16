import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ================= PLACE ORDER =================

const placeOrder = async (req, res) => {
    try {

        const { userId } = req.body;

        const {
            items,
            amount,
            address
        } = req.body;


        // Check required fields
        if (!items || !amount || !address) {
            return res.json({
                success: false,
                message: "Please provide all order details"
            });
        }


        // Check user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }


        // Create order in MongoDB
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: "Stripe",
            payment: false
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(res.body.userId,{cartData:{}});


        // Stripe Checkout Session
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",

                product_data: {
                    name: item.name
                },

                unit_amount:item.price * 100 *80
            },

            quantity: item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({

            line_items: line_items,

            mode: "payment",

            success_url:
                "http://localhost:5173/verify?success=true&orderId=" +
                newOrder._id,

            cancel_url:
                "http://localhost:5173/verify?success=false&orderId=" +
                newOrder._id

        });


        res.json({
            success: true,
            session_url: session.url
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error placing order"
        });
    }
};



// ================= VERIFY ORDER =================

const verifyOrder = async (req, res) => {

    try {

        const {
            orderId,
            success
        } = req.body;


        if (success === "true") {

            await orderModel.findByIdAndUpdate(
                orderId,
                {
                    payment: true
                }
            );


            const order = await orderModel.findById(orderId);

            if (order) {

                await userModel.findByIdAndUpdate(
                    order.userId,
                    {
                        cartData: {}
                    }
                );
            }


            res.json({
                success: true,
                message: "Payment successful"
            });

        } else {

            await orderModel.findByIdAndDelete(orderId);

            res.json({
                success: false,
                message: "Payment failed"
            });
        }


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};



// ================= USER ORDERS =================

const userOrders = async (req, res) => {

    try {

        const {
            userId
        } = req.body;


        const orders = await orderModel.find({
            userId: userId
        }).sort({
            createdAt: -1
        });


        res.json({
            success: true,
            data: orders
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching orders"
        });
    }
};



// ================= LIST ALL ORDERS =================

const listOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({})
            .sort({
                createdAt: -1
            });


        res.json({
            success: true,
            data: orders
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching orders"
        });
    }
};



// ================= UPDATE ORDER STATUS =================

const updateStatus = async (req, res) => {

    try {

        const {
            orderId,
            status
        } = req.body;


        await orderModel.findByIdAndUpdate(
            orderId,
            {
                status: status
            }
        );


        res.json({
            success: true,
            message: "Order status updated"
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error updating status"
        });
    }
};



export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
};