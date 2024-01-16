import express from "express";
import Joi from "joi";
import { isEmptyBody ,autenticate} from "../../helpers/middlewares.js";
import { userSignupSchema ,userSigninSchema} from "../../models/User.js";
import { validateBody } from "../../helpers/middlewares.js";
import authController from "../../controllers/auth-controller.js";
import  upload  from "../../helpers/upload.js";

export const authRouter=express.Router();

authRouter.post("/register",upload.single("avatar"),isEmptyBody, validateBody(userSignupSchema),authController.signup);
// authRouter.post("/register",isEmptyBody, validateBody(userSignupSchema),authController.signup);

authRouter.post("/login",isEmptyBody, validateBody(userSigninSchema),authController.signin)
authRouter.get("/current",autenticate,authController.getCurrent);
authRouter.post("/logout",autenticate,authController.logout)
authRouter.patch("/avatars",upload.single("avatar"),autenticate,authController.updateAvatar)

export default authRouter;
/*\ 

{
        "email":"asdq",
        "password":"123456",
        "subscription":"pro"
}
http://localhost:3000/users/login
http://localhost:3000/api/contacts
{
        "name":"roman12",
        "email":"12345@qw.wq",
        "phone":"12345161278",
        "favorite":true
}


*/