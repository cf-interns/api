import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/createUser.dto";


@Injectable()
export class  UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    async createUser(userData: CreateUserDto): Promise<void> {

            const user = this.userRepo.create(userData);
            console.log("userData ======>>",user);
            
            await this.userRepo.save(user);

            if (!user) {
            throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST)
                
            }
            
       
            
        
    }

    async getByEmail(email: string): Promise<User> {
        const getUser = await this.userRepo.findOne({
            where: {
                email
            }
        });

        if (getUser) {
            return getUser;
        };

        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
}