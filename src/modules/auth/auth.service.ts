import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt'
import { RegisterDataDto } from "src/dtos/reister.dto";
import PostgresErrorCode from "src/enums/postgresErrorCode.enum";
import { User } from "../user/user.entity";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) {}

    public async register(registerData: RegisterDataDto): Promise<void>{
          try {
            const hashPassword = await bcrypt.hash(registerData.password, 10);
             await this.userService.createUser({
                ...registerData,
                password: hashPassword
            });
            console.log('User Created!');
            
          } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }
          }
    }

    public async loginUser(email: string, password: string): Promise<User> {
        try {
            const getUser = await this.userService.getByEmail(email);
            await this.verifyThisUsersPassword(password, getUser.password);
            return getUser
        } catch (error) {
            throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);
        }
    }

    public async verifyThisUsersPassword(password: string, passwordInDb: string) {
        const bcryptVerify = await bcrypt.compare(password,passwordInDb);
        if (!bcryptVerify) {
            throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);
        }
    }
}


//C => Create User
//RUD 

// Create an app for a user(_id, name, token)  ==> User?