
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { LikeSchema } from "./likeSchema.js";


const LikeModel = mongoose.model('Like' , LikeSchema)

export class LikeRepository{



async likeProduct(userID , productID){
    try{

        const newLike = new LikeModel({
            user: new ObjectId(userID),
            likeable: new ObjectId(productID),
            onModel:'Product'
        });
        await newLike.save();

    
    } catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
    }
async likeCategory(userID , categoryID){
try{
    const newLike = new LikeModel({
        user: new ObjectId(userID),
        likeable: new ObjectId(categoryID),
        onModel:'Product'
    });
    await newLike.save();



} catch(err){
    console.log(err);
    throw new ApplicationError("Something went wrong with database", 500);
}
}

async getLikes(type , id){
    return await LikeModel.find({
        likeable : new ObjectId(id) ,
        onModel : type
    }).populate('user').populate({path : 'likeable' , model : type}) //model and path are inbuilt of populate
}//populate user, then populate likeable from model of defined type
}