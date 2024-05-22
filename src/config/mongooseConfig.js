import mongoose from 'mongoose'
import dotenv from 'dotenv' ;
import { categorySchema } from '../features/product/categorySchema.js';
dotenv.config();

// const Url = process.env.DB_URL;
const Url = "mongodb+srv://testuser:Password1@cluster0.czrkn9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/ecomdb"


export const connectUsingMongoose = async ()=>{
   try{await  mongoose.connect(Url , {
        useNewUrlParser : true ,
        useUnifiedTopology : true 
    })
    console.log("connected using mongoose")
    addCategories();
}catch(err){
       console.log(err)
       console.log("failed to connect using mongoose")
     
}
async function addCategories(){
    const CategoryModel = mongoose.model('Category' , categorySchema)
    const categories = await CategoryModel.find();
    if(!categories || categories.length==0){
        await CategoryModel.insertMany([ {name : 'Books'} ,{name : 'Clothing'} , {name : 'Electronics'} ])
    }
    console.log("Categories Created/Present")
}
}