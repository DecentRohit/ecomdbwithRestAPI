import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";
import UserRepository from "./user.respository.js";
import bcrypt from 'bcrypt';

export default class UserController {
  
  constructor(){
    this.userRepository = new UserRepository();
  }
async signUp(req, res) {
  try {   
    const { name,email, password,type, } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new UserModel(
      name,
      email,
      hashedPassword,
      type
    );
    await this.userRepository.signUp(user);
    res.status(201).send(user);
 
}
catch(err){console.log(err);
  return res.status(200).send("Something went wrong");
}
}

async resetPassword(req, res){
  try{
 const {newPassword} = req.body;
 const hashedPassword = await bcrypt.hash(newPassword , 12)
const userID = req.userID;
await this.userRepository.resetPassword(userID , hashedPassword)
res.status(200).send("Password is updated");
  }catch(err){
    console.log(err);
    return res.status(200).send("Something went wrong");
  }
}
async signIn(req, res) {
  try{
    // 1. Find user by email.
    const user = await this.userRepository.findByEmail(req.body.email);
    if(!user){
      return res
      .status(400)
      .send('Incorrect Credentials');
    } else {
      // 2. Compare password password with hashed password.
      const result = await bcrypt.compare(req.body.password, user.password);
      if(result){
        // 3. Create token.
        const token = jwt.sign(
          {
            userID: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );
    
    // 4. Send token.
    return res.status(200).send(token);
      } else {
        return res
      .status(400)
      .send('Incorrect Credentials');
      }
    }
} catch(err){
    console.log(err);
    return res.status(200).send("Something went wrong");
  }
}

async getAllUsers(req, res){
  const Users = await this.userRepository.getUsers()
  if (!Users) {
    return res
      .status(400)
      .send('No users found');
  } else {
    return res.status(201).send(Users);
  }
}
  
}
