
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
export default class ProductController{
    constructor(){
        this.productRepository = new ProductRepository();
    }

   async getAllProducts(req, res){
 try{  
    const products = await this.productRepository.getAll();
   res.status(200).send(products);
    }catch(err){
        return res.status(200).send("Something went wrong");
    
    }}

    async addProduct(req, res){
   try{   
        console.log(req.file,"req.file")
      const  {name , price,categories, description} = req.body;

    const newProduct = new ProductModel(
        name , 
       description,
        parseFloat(price), 
    //    req?.file?.filename,
       categories,
    //    sizes?.split(',')
   )
    const updatedProducts = await this.productRepository.add(newProduct);
    res.status(201).send(updatedProducts);
    }
catch(err){
    console.log(err);
    return res.status(200).send("Something went wrong");
}}
   

 async   rateProduct(req, res, next) {
        try { 
        const userID = req.userID;
        const productID = req.body.productID;
        const rating = req.body.rating;
       
       await   this.productRepository.rate(
            userID,
            productID, 
            rating
            );
            return res
            .status(200)
            .send('Rating has been added');
         } catch(err) {
            console.log("Passing error to middleware");
            next(err);
         }
       
        }

    async getOneProduct(req,res){

    const productId =   req.params.id;
    const OneProduct = await this.productRepository.get(productId)
    if(!OneProduct){
        res.status(404).send("Product not found")
    }
    else{
        res.status(200).send(OneProduct)
    }
    
    }
  async  filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const categories = req.query.categories;
        const result = await this.productRepository.filter(
            minPrice,
            // maxPrice,
            categories
        );
        res.status(200).send(result);
    }

    //get =  products/averagePrice
    async averagePrice(req, res, next){
        try{
          const result =await this.productRepository.averageProductPricePerCategory();
          res.status(200).send(result);
        }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
      }
      }
}