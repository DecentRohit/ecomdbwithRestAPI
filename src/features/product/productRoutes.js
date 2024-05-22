import express from "express";
import productController from "./productControllers.js"
import { upload } from "../../middlewares/fileUploadMiddleware.js";

const router = express.Router();

const productsController = new productController();

// All the paths to the controller methods.
// localhost/api/products 
router.post('/rate', (req, res , next)=>{productsController.rateProduct(req, res , next)});
router.get('/filter' ,(req, res)=>{productsController.filterProducts(req, res)})
router.get('/', (req, res)=>{productsController.getAllProducts(req, res)});
//make sure this is above :id to not get averageprice as id of params
router.get("/averagePrice", (req, res, next)=>{productsController.averagePrice(req, res)});
router.get('/:id', (req, res)=>{productsController.getOneProduct(req, res)});

router.post('/',upload.single('imageUrl') , (req, res)=>{productsController.addProduct(req, res)});


export default router;