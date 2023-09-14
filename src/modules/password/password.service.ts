import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from './password.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './restPassword.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(Password)
    private passwordRepo: Repository<Password>,
    private readonly emailService: MailerService,
    private readonly usersService: UserService
  ) { }


  async findOne(token: string) {
    return this.passwordRepo.findOne({
      where: {
        token: token
      }
    });
  }

  async createPassword(mail: string,) {
    // const {email} = mail;
    const pass = this.passwordRepo.create({
      mail
    });

    await this.passwordRepo.save(pass);
    const token = pass.token
    const url = `http://localhost:5000/reset/${token}`;
    // const mailTo = mail.email

    await this.emailService.sendMail({
      to: mail,
      subject: 'Reset Password',
      html: `Click <a href="${url}">here</a> to reset your password`
    });

    return {message: "Please check your email for further instructions"}

  }

  async resetPassword(pass: ResetPasswordDto) {
    const { password, confirmPassword, token } = pass;
    // console.log(pass, "object");


    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do no match!')
    }

    const restPass = await this.findOne(token);
    // const mail2 = restPass.mail;

    // console.log(mail2, '<<Token Object');


    const user = await this.usersService.getByEmail(restPass.mail);
    // console.log(user, '<<=====User');

    if (!user) {
      throw new NotFoundException('Email Successfully Sent!')
    };

    const hashPassword = await bcrypt.hash(pass.password, 10);

    await this.usersService.updateUserData((await user)._id, { password: hashPassword });

    await this.emailService.sendMail({
      to: restPass.mail,
      subject: 'Password Changed!',
      html: `This Email is to infrom you that your password has been changed! If you did not initiate this change sorry someone changed your password and we can't do $hit. JK lol! Please contact us <a href="http://localhost:5000/">@help-deskgns<a/>`
    });

    return {message: 'Password Succefully Changed!'}


  }
}
