import { Schema,model } from "mongoose";
import { User } from "./User.js";

const contactSchema=new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
      owner:{
        type: Schema.Types.ObjectId,
        ref: User,
        required:true,
      },
 },{versionKey:false});
contactSchema.post("save",(error,data,next)=>{
    error.status=400;
    next();
})
const contact=model("contact",contactSchema);

export default contact;