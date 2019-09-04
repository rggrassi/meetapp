const nodemailer = require('nodemailer');
const nodemailerhbs = require('nodemailer-express-handlebars');
const exphbs = require('express-handlebars');
const { resolve } = require('path');
const config = require('../config/mail');

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