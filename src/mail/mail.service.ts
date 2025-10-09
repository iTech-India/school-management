import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    constructor(){
        this.transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
        })
    }
    async sendPassMail(email:string,token:string){
        const link=`http://localhost:3000/auth/set-password?token=${token}`
        await this.transporter.sendMail(({
            from:'SchoolManagement<vsatvivek@gmail.com>',
            to:email,
            subject:"Set Your Password",
            html:`<p> Click <a href="${link}">Here</a> To Set Password</p>`
        }))
    }
}
