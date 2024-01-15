import multer from "multer";
import path from "path";
// import {HttpError} from "./errors.js"; 
// import{HttpError} from "./errors.js";

const destination=path.resolve("temp");

const storage=multer.diskStorage({
    destination,
    filename:(req,file,callback)=> {
        const uniquePrefix=`${Date.now()}_${Math.round(Math.random()*1E9)}`;
        const filename=`${uniquePrefix}_${file.originalname}`;
        callback(null,filename);
    }
});
const limits={
    fileSize: 1024*1024*5,
};

 const upload=multer({
    storage,
    limits,    
});
// console.log("upload",upload);

export default upload;