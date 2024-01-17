import { isValidObjectId } from "mongoose";
import{HttpError} from "./errors.js";
import jwt from  "jsonwebtoken";
import { User }  from "../models/User.js";
import Jimp from "jimp";
// const { JWT_SECRET } = process.env; 

export const isValidId =(req,res,next)=>{
    const {contactId}=req.params;  
    if (!isValidObjectId(contactId)) {
        return next(HttpError(404,`Not found` ))
    }
    next();
}


export const isEmptyBody = (req, res, next)=> {
    const {length} = Object.keys(req.body);
    if(!length) {
        return next(HttpError(400, "Missing fields"));
    }
    next();
}

export const validateBody = schema => {
    const func = (req, res, next)=> {
        const {error} = schema.validate(req.body);
        if(error) {
            return next(HttpError(400, error.message));
        }
        next();
    }
    
    return func;
}

export const ctrlWrapper = ctrl => {
    const func = async(req, res, next)=> {
        try {
            await ctrl(req, res, next);
        }
        catch(error) {
            next(error);
        }
    }

    return func;
}

export const autenticate=async(req,res,next)=>{
    const {authorization}=req.headers;
   
    if (!authorization) {
        return next(HttpError(401,"Not authorized"));
    }
    
    const [bearer, token]=authorization.split(" ");
 
    if (bearer!=="Bearer") {
        return HttpError(401,"Not authorized")
    }
    try {
        const {id}=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(id);
        if (!user || !user.token || token!==user.token) {
            return next(HttpError(401,"Not authorized"));
        }
       req.user=user;
        next()
    } catch (error) {
        next(HttpError(401,error.message));
    }
}


export const resolution=(path)=>{
    Jimp.read(path, (err, image) => {
        if (err) throw err;
        image.resize(250, 250);
        image.write(path, (err) => {
            if (err) throw err;
        });
        // console.log("oldavapath",oldAvatarPath);
    
    
     /*  fs.unlink(oldAvatarPath, (err) => { 
             if (err) {
                console.error(`Помилка видалення файлу: ${err}`);
            } else {
                console.log(`Файл ${filePath} успішно видалено`);
      }
    });*/
      });

}