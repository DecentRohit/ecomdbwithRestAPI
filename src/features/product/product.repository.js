import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../../error-handler/applicationError.js"
import { productSchema } from './ProductSchema.js';
import { reviewSchema } from './reviewSchema.js';
import { categorySchema } from './categorySchema.js';

const ProductModel = mongoose.model('Product' , productSchema )
const ReviewModel = mongoose.model('Review' , reviewSchema)
const CategoryModel = mongoose.model('Category' , categorySchema)
class ProductRepository{

    constructor(){
        this.collection = "products";
    }
 
    async add(productData){
        try{
            // // 1 . Get the db.
            // const db = getDB();
            // const collection = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;
              // 1. Adding Product
              console.log(productData)
              productData.categories=productData.category.split(',');
              console.log(productData);
              const newProduct = new ProductModel(productData);
              const savedProduct = await newProduct.save();
  
              // 2. Update categories.
              await CategoryModel.updateMany(
                  {_id: {$in: productData.categories}},
                  {$push: {product: new ObjectId(savedProduct._id)}}
              )
              console.log("categories and products updated")
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async filter(minPrice, categories){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            // }
            categories = JSON.parse(categories.replace(/'/g, '"'));//converting single quote to double 
            //now in url pass e.g. cartItems/categorie=["cat1', 'cat2"]&minPrice=88000
         console.log(categories)
            if(categories){
                filterExpression={$or:[{category:{$in: categories}}, filterExpression]}
            }
            return await collection.find(filterExpression).project({name:1, price:1, _id:0 ,ratings:{$slice : 1}}).toArray();
            
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async rate(userID, productID, rating){
        try{
          
          const productToRate =await ProductModel.findById(productID);
          if(!productToRate){
           throw new Error("Product not found")
          }
         const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
         if(userReview){
                  userReview.rating = rating;
                 await userReview.save();
         }else{
             const newReview = await new ReviewModel({
                product : new ObjectId(productID),
                 user: new ObjectId(userID),
                rating : rating
              });
            await  newReview.save();
         }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    async averageProductPricePerCategory(){
        try{
            const db=getDB();
            return await db.collection(this.collection)
                .aggregate([
                    {
                        // Stage 1: Get Vaerge price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg:"$price"}
                        }
                    }
                ]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

}

export default ProductRepository;