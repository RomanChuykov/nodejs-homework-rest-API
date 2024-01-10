import{Schema,model} from "mongoose"
import Joi from "joi";
import { handleSaveError } from "../helpers/errors.js";

const subscriptionlist=["starter", "pro", "business"]
const UserSchema=new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: subscriptionlist,
        default: "starter"
    },
    token: String,      
},{versionKey:false,timestamps:true});
UserSchema.post("save", handleSaveError)

export const userSignupSchema= Joi.object({
   password: Joi.string().required(),
   email: Joi.string().required(),
   subscription:Joi.string().valid(...subscriptionlist), 
});
export const userSigninSchema= Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription:Joi.string().valid(...subscriptionlist), 
 });
 
 export const User=model("user",UserSchema)