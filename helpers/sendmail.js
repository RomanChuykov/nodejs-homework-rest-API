import nodemailer from "nodemailer";
import "dotenv/config";

const {EMAIL_PASSWORD, EMAIL_FROM} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);



const sendEmail = data => {
    const email = {...data, from: EMAIL_FROM};
    return transport.sendMail(email);
}

export default sendEmail;

