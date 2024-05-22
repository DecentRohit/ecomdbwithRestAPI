
import { MongoClient } from "mongodb";


// If the above url gives error (error may be caused due to IPv4/IPv6 configuration conflict), then try the url given below
// const url = "mongodb://127.0.0.1:27017/ecomdb";
let client;
export const connectToMongoDB = ()=>{
     MongoClient.connect("mongodb+srv://Decent:Rohitsoni#1@cluster0.cbivu4s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/ecomdb")
        .then(clientInstance=>{
            client=clientInstance
            console.log("Mongodb is connected");
            cartCounter(client.db())
            createIndexes(client.db())
        })
        .catch(err=>{
            console.log(err);
        })
}
export const getClient = ()=>{
    return client;  //just give instance of client just after connected to database
    
}

export const getDB = ()=>{
   return client.db();//write dbname inside function if not given in url "ecomdb"
}
export const cartCounter = async (db) => {
  const counterExists =  await db.collection("counter").findOne({_id : 'cartItemId'});
  if(!counterExists){
    db.collection("counter").insertOne({_id : 'cartItemId' , value :0});
  }
}
const createIndexes = async(db)=>{
    try{
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc: "text"});
    }catch(err){
        console.log(err);
    }
    console.log("Indexes are created");
    }


export default connectToMongoDB;