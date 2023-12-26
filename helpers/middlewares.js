import { isValidObjectId } from "mongoose";
import{HttpError} from "./errors.js";

export const isValidId =(req,res,next)=>{
    const {contactId}=req.params;
    console.log(req.params)
    console.log("middle-",contactId);

    if (!isValidObjectId(contactId)) {
        return next(HttpError(404,`${contactId} not valid id` ))
    }
    next();
}
