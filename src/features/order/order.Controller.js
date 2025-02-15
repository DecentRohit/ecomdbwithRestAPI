import { ApplicationError } from "../../../error-handler/applicationError.js"
import OrderRepository from "./order.repository.js";



export default class OrderController {
  
  constructor(){
    this.orderRepository = new OrderRepository()
  }

  async placeOrder(req, res){
    try{
        const userId =  req.userID;
const result = await this.orderRepository.placeOrder(userId)
res.status(201).send("Order is created");
    }catch(err){
        console.log(err);
            return res.status(200).send("Something went wrong"); 
    }

  }

  
  
}
