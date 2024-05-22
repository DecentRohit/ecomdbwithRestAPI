import express from 'express';
import OrderController from './order.Controller.js';

// 2. Initialize Express router.
const orderRouter =  express.Router();

const orderController = new OrderController();

// All the paths to controller methods.
orderRouter.post('/', (req, res)=>{
    orderController.placeOrder(req, res)
});


export default orderRouter;
