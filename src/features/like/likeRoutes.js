import express from "express";
import { LikeController } from "./likeController.js";


const likeRouter = express.Router();

const likecontroller = new LikeController();


likeRouter.post('/',(req, res)=>{likecontroller.addLike(req, res)});
likeRouter.get('/',(req, res , next)=>{likecontroller.getLikes(req, res , next)});
export default likeRouter;