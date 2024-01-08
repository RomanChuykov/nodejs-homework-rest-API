import { isValidObjectId } from "mongoose";
import{HttpError} from "./errors.js";
import jwt from  "jsonwebtoken";
import { User }  from "../models/User.js";
// const { JWT_SECRET } = process.env; 

export const isValidId =(req,res,next)=>{
    const {contactId}=req.params;
    console.log(req.params)
    console.log("middle-",contactId);
    
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