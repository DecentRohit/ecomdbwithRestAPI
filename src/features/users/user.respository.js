import mongoose from "mongoose";
import { UserSchema } from "./userSchema.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";

const UserModel = mongoose.model('User' , UserSchema)  //user is name of collection and telling that its for userSchema

export default class UserRepository{
    async signUp(user){
        try{
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        }catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                console.log(err);
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
    }
    async signIn(email, password){
        try{
           return await UserModel.findOne({email, password});
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    async resetPassword(userID , hashedPassword){
        try{
            const user = await UserModel.findById(userID);
            if(user){
                user.password=hashedPassword;
                user.save();
            }else{
                throw new Error("No such user found");
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
      }
    async findByEmail(email) {
        try{
        return await UserModel.findOne({email});
      }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
      }
      }
}

