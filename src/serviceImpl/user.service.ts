import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../domains/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/createUser.dto";
import * as bcrypt from 'bcrypt';
import { updateUserPassword } from "../dtos/updataUserData.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>

    ) { }



    async getById(_id: string): Promise<User> {
        const user = await this.userRepo.findOne({
            where: {
                _id
            }
        });
        if (user) {
            return user;
        };

        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }


    async getUsers(): Promise<User[]> {

        const allUsers = await this.userRepo.find({
            relations: ['apps']
        });
        return allUsers;
    }

    async createUser(userData: CreateUserDto): Promise<void> {
        console.log(userData);

        const user = this.userRepo.create(userData);
        // console.log("userData ======>>",user);

        //user.token = ''
        await this.userRepo.save(user);

        if (!user) {
            throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST)

        }

       

    }

    async getByEmail(email: string): Promise<User> {
        const getUser = await this.userRepo.findOne({
            where: {
                email: email
            }
        });
        console.log(getUser, 'Service Email');


        if (getUser) {
            return getUser;
        };

        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }



    async getUserIfRefreshTokenMatches(refreshToken: string, _id: string): Promise<User> {
        const user = await this.getById(_id);

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken
        );

        if (!isRefreshTokenValid) {
            return user
        }
    }



    async updateUserData(_id: string, updatePasswordDto: updateUserPassword) {
        const user = await this.getById(_id);
        user.password = updatePasswordDto.password;
        await this.userRepo.save(user);
    }

    //Save hash of Refresh_Token
    async setCurrentRefreshToken(refreshToken: string, userId: string): Promise<any> {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        return await this.userRepo.update(userId, { currentHashedRefreshToken });
    }

    async removeRefreshToken(_id: string) {
        return this.userRepo.update(_id, {
            currentHashedRefreshToken: null
        })
    }
}