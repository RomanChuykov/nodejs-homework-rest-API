import { User } from "../models/User.js"; 
import HttpError from "../helpers/errors.js";
import { ctrlWrapper } from "../helpers/middlewares.js";
import bcrypt from "bcrypt"; 
import jwt from  "jsonwebtoken"; 
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { resolution } from "../helpers/middlewares.js";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendmail.js";

const avatarPath=path.resolve("public", "avatars");
// const { JWT_SECRET } = process.env;. 
// const JWT_SECRET1 = process.env.JWT_SECRET;
// const JWT_SECRET1 = process.env.JWT_SECRET;
 


const signup=async(req,res,next)=>{
     const {email,password}=req.body;
     
     const user=await User.findOne({email})
     if (user) {
         throw HttpError(409,"Email in use")
        }
        const hashPass=await bcrypt.hash(password,10);
        const verificationToken=nanoid();

        let avatar = `https://www.gravatar.com/avatar/${email}?s=${100}`;
        if (req.file) {
            const {path:oldPath,filename}=req.file;
            const newPath=path.join(avatarPath,filename)
//  console.log("newPath",newPath);
//  console.log("oldpath",oldPath)            
            await fs.rename(oldPath,newPath);
            resolution(newPath);
             avatar=path.join("avatars",filename); 
        }
//  console.log(avatar)
    const newUser=await User.create({...req.body,avatar,password:hashPass,verificationToken});
    const verifyEmail={
        to:email,
        subject:"Verify email",
        html:`<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Click to verify</a>`
    };
    sendEmail(verifyEmail);
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatar: newUser.avatar, 
        },
    })
} 
//***************************    login************************* */                  
const signin=async(req,res,next)=>{

    const {email,password}=req.body;
    const user=await User.findOne({email});
    if (!user) {
        throw HttpError(401,"email or password is wrong ");
    }
    if (!user.verify) {
        throw HttpError(404,"User not found");
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if (!passwordCompare) {
        throw HttpError(401,"email or password is wrong");
    }
    const{_id: id}=user;
    const payload={
        id
    }
    // console.log("payload",payload)
    const token=jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"24h"});
   
    const { _id,  createdAt, updatedAt, ...userDetails } = user._doc;
    const { password: _,token: __, ...userWithoutPassword } = userDetails;
    await User.findByIdAndUpdate(id, {token});
    res.json({
    token: token,
    user: userWithoutPassword,
});   
};
// *********************   current  *******************************
const getCurrent=async(req,res)=>{
  
    res.json({
        email,
        subscription,
});
};

const logout=async(req,res)=>{
    const {_id}=req.user;
    await User.findByIdAndUpdate(_id,{token:""})
    res.status(204).json()
};

const updateAvatar = async (req, res) => {
    if (!req.file) {
		throw HttpError(400,"file not found");
	}
    const { token } = req.user;
    const oldFileName=path.basename(req.user.avatar)
    const oldAvatarPath =path.join(avatarPath, oldFileName);
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("avatars", filename);

    resolution(newPath)


    const  firstFourChars = oldAvatarPath.slice(0, 4);
    if (firstFourChars!=='http') {
        fs.unlink(oldAvatarPath, (err) => { 
            if (err) {
            console.error(`Помилка видалення файлу: ${err}`);
        } else {
            console.log(`Файл ${filePath} успішно видалено`);
        }
        });
    }
	const result = await User.findOneAndUpdate({ token }, { avatar }, { new: true });
 	if (!result) {
		throw HttpError(404, "User not found");
	}
	if (req.user.avatar) {
		const oldAvatarPath = path.join(path.resolve("public", req.user.avatar));
	}
	res.json({
		avatar: result.avatar,
	});
};

const verify=async (req, res) =>{
    const {verificationToken}=req.params;
    const user=await User.findOne({verificationToken});
    if (!user) {
        throw HttpError(404,"User not found");
    }
    await User.findByIdAndUpdate(user._id,{verify:true,verificationToken:""});
    // console.log("User",User);
    res.json({
        message:"Verification successful",
    })
}

const resentVerifyEmail= async (req,res)=>{
    const {email}=req.body;
    // const user=await User.findOne({email});
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404,"email not found");
    }
    if (user.verify) {
        throw HttpError(400,"Verification has already been passed");
    }
    const verifyEmail={
        to:email,
        subject:"Verify email",
        html:`<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">Click to verify</a>`
    };
    await sendEmail(verifyEmail);
    
    console.log("user",user)
   res.json({
    message: "Verification email sent",
});

};

export default{
    signup:ctrlWrapper(signup),
    signin:ctrlWrapper(signin),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    verify:ctrlWrapper(verify),
    updateAvatar:ctrlWrapper(updateAvatar),
    resentVerifyEmail:ctrlWrapper(resentVerifyEmail),
}