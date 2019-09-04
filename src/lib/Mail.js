import nodemailer from 'nodemailer';
import nodemailerhbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import { resolve } from 'path'
import config from '../config/mail';

const { host, port, secure, auth } = config;
const transporter = nodemailer.createTransport({ 
    host,
    port, 
    secure, 
    auth: auth.user ? auth : null 
}); 

//Configure templates
const viewPath = resolve(__dirname, '..', 'views', 'emails');
transporter.use('compile', nodemailerhbs({
    viewEngine: exphbs.create({ 
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs'
    }),
    viewPath,
    extName: '.hbs'
}))

export default function sendMail(email) {
    return transporter.sendMail({ ...config.default, ...email });                
}