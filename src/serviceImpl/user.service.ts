import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../domains/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { updateUserPassword } from "../dtos/updataUserData.dto";
import { ChangePasswordDto } from "src/dtos/changePassword.dto";
import { Password } from "src/domains/password.entity";
import { ResetPasswordDto } from "src/dtos/restPassword.dto";
import { EmailService } from "./email.service";
import EmailDto from "src/dtos/email.dto";
import { UpdateUserInfoDto } from "src/dtos/updateUserInfo.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Password)
    private passwordRepo: Repository<Password>,
    private readonly emailService: EmailService
  ) {}

  public async verifyThisUsersPassword(password: string, passwordInDb: string) {
    const bcryptVerify = await bcrypt.compare(password, passwordInDb);
    if (!bcryptVerify) {
      throw new HttpException("Invalid login", HttpStatus.BAD_REQUEST);
    }
  }

  async getById(_id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        _id,
      },
    });
    if (user) {
      return user;
    }

    throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
  }

  async getUsers(): Promise<User[]> {
    const allUsers = await this.userRepo.find();
    return allUsers;
  }

  async createUser(userData: CreateUserDto): Promise<void> {
    console.log(userData);

    const user = this.userRepo.create(userData);

    await this.userRepo.save(user);

    if (!user) {
      throw new HttpException("Something Went Wrong", HttpStatus.BAD_REQUEST);
    }
  }

  async getByEmail(email: string): Promise<User> {
    const getUser = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    console.log(getUser, "Service Email");

    if (getUser) {
      return getUser;
    }

    throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    _id: string
  ): Promise<User> {
    const user = await this.getById(_id);

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (!isRefreshTokenValid) {
      return user;
    }
  }

  async updateUserData(_id: string, updatePasswordDto: updateUserPassword) {
    const user = await this.getById(_id);
    user.password = updatePasswordDto.password;
    await this.userRepo.save(user);
  }

  //Save hash of Refresh_Token
  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<any> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return await this.userRepo.update(userId, { currentHashedRefreshToken });
  }

  async removeRefreshToken(_id: string) {
    return this.userRepo.update(_id, {
      currentHashedRefreshToken: null,
    });
  }

  async changePassword(_id: string, pass: ChangePasswordDto) {
    try {
      const getUser = await this.getById(_id);
      await this.verifyThisUsersPassword(pass.oldPassword, getUser.password);

      if (getUser) {
        const hashPassword = await bcrypt.hash(pass.newPassword, 10);
        await this.updateUserData(getUser._id, { password: hashPassword });
        return { message: "Password Succefully Changed" };
      }
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        "Icorrect Password. Please enter the current password"
      );
    }
  }

  async findPassword(token: string) {
    return this.passwordRepo.findOne({
      where: {
        token,
      },
    });
  }

  async createPassword(mail: EmailDto) {
    const pass = this.passwordRepo.create({
      mail: mail.to,
    });

    await this.passwordRepo.save(pass);
    const token = pass.token;
    const url = `http://loacalhost:5173/reset-password/${token}`;

    await this.emailService.sendMail({
      to: mail.to,
      subject: mail.subject,
      from: mail.from,
      html: `Click <a href='${url}'>here</a> to reset your password`,
    });

    return { message: "Please check your email for further instructions" };
  }

  async resetPassword(pass: ResetPasswordDto) {
    const { password, confirmPassword, token } = pass;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match!");
    }

    const resetPass = await this.findPassword(token);

    const user = await this.getByEmail(resetPass.mail);

    if (!user) {
      throw new NotFoundException("Email successfully Sent! ");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await this.updateUserData(user._id, { password: hashPassword });

    await this.emailService.sendMail({
      to: resetPass.mail,
      from: "no-reply@payunit.net",
      subject: "Password Changed!",
      html: `This Email is to infrom you that your password has been changed! If you did not initiate this change sorry someone changed your password and we can't do $hit. JK lol! Please contact us <a href="http://localhost:5000/">@help-deskgns<a/>`,
    });

    return { message: "Password Successfully Changed!" };
  }

  async updateUserInfo(user: User, userInfo: UpdateUserInfoDto) {
    const getUser = await this.getByEmail(user.email);
    console.log(user.email, "", userInfo.email);

    if (getUser) {
      const updatedUser = {
        _id: getUser._id,
        password: getUser.password,
        apps: getUser.apps,
        lastName: userInfo.lastName,
        firstName: userInfo.firstName,
        currentHashedRefreshToken: getUser.currentHashedRefreshToken,
        email: userInfo.email,
      };

      await this.userRepo.update(user._id, updatedUser);

      return {
        message: "Success",
      };
    }

    throw new NotFoundException("User Not Found!");
  }

  async deleteUser(_id: string): Promise<void> {
    const deleteThisUser = await this.userRepo.delete(_id);
    if (deleteThisUser.affected === 0) {
      throw new NotFoundException("User Not Found!");
    }
  }
}
