import { User } from "../models/User.js"; 
import HttpError from "../helpers/errors.js";
import { ctrlWrapper } from "../helpers/middlewares.js";
import bcrypt from "bcrypt"; 
import jwt from  "jsonwebtoken"; 
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
 
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
        
        let avatar = `https://www.gravatar.com/avatar/${email}?s=${100}`;
        if (req.file) {
            const {path:oldPath,filename}=req.file;
            const newPath=path.join(avatarPath,filename) 
            await fs.rename(oldPath,newPath);
             avatar=path.join("avatars",filename); 
        }
//  console.log(avatar)
    const newUser=await User.create({...req.body,avatar,password:hashPass});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatar: newUser.avatar, 
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

const updateAvatar = async (req, res) => {
    if (!req.file) {
		throw HttpError(400,"file not found");
	}
    const { token } = req.user;
	let avatar = req.user.avatar;
// console.log("req.file",req.file)
	
        const { path: oldPath, filename } = req.file;
		const newPath = path.join(avatarPath, filename);
// console.log("oldpath",oldPath);
// console.log("newpath",newPath);
        // await fs.rename(oldPath, newPath);
		avatar = path.join("avatars", filename);
//********************* */
Jimp.read(oldPath, (err, image) => {
    if (err) throw err;
    image.resize(250, 250);

    image.write(newPath, (err) => {
      if (err) throw err;
     
    });
  });
// **************************
    
// console.log("avatar",avatar);

	const result = await User.findOneAndUpdate({ token }, { avatar }, { new: true });
 	if (!result) {
		throw HttpError(404, "User not found");
	}
	if (req.user.avatar) {
		const oldAvatarPath = path.join(path.resolve("public", req.user.avatar));
		await fs.unlink(oldAvatarPath);
	}

	res.json({
		avatar: result.avatar,
	});
};

export default{
    signup:ctrlWrapper(signup),
    signin:ctrlWrapper(signin),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    updateAvatar:ctrlWrapper(updateAvatar)
}