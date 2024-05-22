import express from "express";
import swagger from 'swagger-ui-express';
import dotenv from "dotenv";
dotenv.config();
import productRouter from "./src/features/product/productRoutes.js";
import { ApplicationError } from "./error-handler/applicationError.js";
import bodyParser from "body-parser";
import UserRouter from "./src/features/users/user.routes.js"
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js"
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js"
import apiDocs from './swagger.json' assert {type: 'json'};
import cors from 'cors';
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import {connectToMongoDB} from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from 'mongoose';
import likeRouter from "./src/features/like/likeRoutes.js";



const server = express();

/// CORS policy configuration
server.use(loggerMiddleware);
var corsOptions = {
  origin: "http://localhost:5500"
}
server.use(cors(corsOptions));
server.use(bodyParser.json()) //npm i body-parser and in postman post>body>raw>json>post an product
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs))
server.use("/api/orders" ,  jwtAuth, orderRouter)
server.use("/api/cartItems", jwtAuth, cartRouter);
server.use('/api/products' , jwtAuth /*basicAuthorizer*/ , productRouter)
server.use('/api/users' , UserRouter)
server.use('/api/likes' , jwtAuth ,likeRouter )



server.get('/' , (req, res) => {
res.send("Ecom homepage")
})
// Error handler middleware,should be placed at last of all other request
server.use((err, req, res, next)=>{
  console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
              return res.status(400).send(err.message);

            }if(err instanceof ApplicationError){
              console.log(err);
              throw new ApplicationError("Something went wrong with database", 500);
             
            }
 

  // server errors.
  res
  .status(500)
  .send(
    'Something went wrong, please try later'
    );
});
// 4. Middleware to handle 404 requests.should be placed at end
server.use((req, res)=>{
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3200/api-docs")
  });

server.listen(3200 , ()=>{
    console.log("server is running at port 3200")
    // connectToMongoDB();
    connectUsingMongoose();
});
  