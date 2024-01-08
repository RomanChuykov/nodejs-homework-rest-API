import express from "express";
import Joi from "joi";
import { isEmptyBody ,autenticate} from "../../helpers/middlewares.js";
import { userSignupSchema ,userSigninSchema} from "../../models/User.js";
import { validateBody } from "../../helpers/middlewares.js";
import authController from "../../controllers/auth-controller.js";
export const authRouter=express.Router();

authRouter.post("/register",isEmptyBody, validateBody(userSignupSchema),authController.signup);
authRouter.post("/login",isEmptyBody, validateBody(userSigninSchema),authController.signin)
authRouter.get("/current",autenticate,authController.getCurrent);
authRouter.post("/logout",autenticate,authController.logout)
export default authRouter;
/*\

{
        "email":"asdq",
        "password":"123456",
        "subscription":"pro"
}
{
        "name":"roman12",
        "email":"12345@qw.wq",
        "phone":"12345161278",
        "favorite":true
}


*/