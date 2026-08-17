import express from "express";

import {
    placeOrder,
    userOrders,
    listOrders,
    updateStatus,
    verifyOrder
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();


// ================= PLACE ORDER =================

orderRouter.post(
    "/place",
    authMiddleware,
    placeOrder
);


// ================= VERIFY ORDER =================

orderRouter.post(
    "/verify",
    authMiddleware,
    verifyOrder
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