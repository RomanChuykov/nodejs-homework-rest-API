import { User } from "../models/User.js"; 
import HttpError from "../helpers/errors.js";
import { ctrlWrapper } from "../helpers/middlewares.js";
import bcrypt from "bcrypt"; 
import jwt from  "jsonwebtoken";

// const  JWT_SECRET=process.env;
// const { JWT_SECRET } = process.env; 
// const JWT_SECRET1 = process.env.JWT_SECRET;
 const signup=async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if (user) {
        throw HttpError(409,"Email in use")
    }
    const hashPass=await bcrypt.hash(password,10);

 
    const newUser=await User.create({...req.body,password:hashPass});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    })
}

const signin=async(req,res,next)=>{

    const {email,password}=req.body;
    const user=await User.findOne({email});
    if (!user) {
        throw HttpError(401,"email or password is wrong ");
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if (!passwordCompare) {
        throw HttpError(401,"email or password is wrong");
    }
    const{_id: id}=user;
    const payload={
        id
    }
    console.log("payload",payload)
    const token=jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"24h"});
   
    const { _id,  createdAt, updatedAt, ...userDetails } = user._doc;
    const { password: _,token: __, ...userWithoutPassword } = userDetails;
    await User.findByIdAndUpdate(id, {token});
    res.json({
    token: token,
    user: userWithoutPassword,
});   
}

const getCurrent=async(req,res)=>{
    // console.log('get current',req.user)
    const {email,subscription}=req.user;
    res.json({
        email,
        subscription,
});
}

const logout=async(req,res)=>{
    const {_id}=req.user;
    await User.findByIdAndUpdate(_id,{token:""})
    res.status(204).json()
}

export default{
    signup:ctrlWrapper(signup),
    signin:ctrlWrapper(signin),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
}