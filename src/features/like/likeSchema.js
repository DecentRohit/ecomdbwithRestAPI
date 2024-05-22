import mongoose from "mongoose";

export const LikeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref: 'User'
    },
   likeable : {
    type : mongoose.Schema.Types.ObjectId , 
        ref: 'onModel'
   } ,
   onModel :{
    type: String ,
    enum : ['Product' , 'Category']
   }
  
}).pre('save', (next)=>{
    console.log("New like coming in");
    next();
})
.post('save', (doc)=>{
    console.log("Like is saved");
    console.log(doc);
}).pre('find', (next)=>{
    console.log("Retriving likes");
    next();
}).post('find', (docs)=>{
    console.log("Post find");
    console.log(docs);
});