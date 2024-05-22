import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class OrderModel {
  constructor(userId , totalAmount , timestamp) {
    this.userId = userId,
    this.totalAmount = totalAmount,
    this.timestamp = timestamp
  
  }

}
