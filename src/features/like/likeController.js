import { LikeRepository } from "./likeRespository.js";


export class LikeController{

constructor(){
this.likeRepository = new LikeRepository();
}
async addLike(req, res){
    try{
        const {id, type} = req.body;
            if(type!='Product' && type!='Category'){
                return res.status(400).send("Invalid");
            }
            if(type=='Product'){
                await this.likeRepository.likeProduct(req.userID, id);
            }else{
                await this.likeRepository.likeCategory(req.userID, id);    
            }
  return res.status(200).send("Like added")
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
}

async getLikes(req, res, next){
    try{
        const {id, type} = req.query;
        const likes = await this.likeRepository.getLikes(type, id);
        console.log(likes)
        return res.status(200).send(likes)
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
      }
}

}