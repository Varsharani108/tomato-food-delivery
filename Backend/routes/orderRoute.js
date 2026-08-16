import express from "express";

import {
    placeOrder,
    userOrders,
    listOrders,
    updateStatus
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();


// ================= PLACE ORDER =================

orderRouter.post(
    "/place",
    authMiddleware,
    placeOrder
);


// ================= USER ORDERS =================

orderRouter.post(
    "/userorders",
    authMiddleware,
    userOrders
);


// ================= ALL ORDERS =================
// Admin use karega

orderRouter.get(
    "/list",
    listOrders
);


// ================= UPDATE ORDER STATUS =================
// Admin use karega

orderRouter.post(
    "/status",
    updateStatus
);


export default orderRouter;