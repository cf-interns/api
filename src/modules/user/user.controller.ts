import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@sentry/node";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { UserService } from "./user.service";


@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Post('sign_up')
    async createUser(@Body() user: CreateUserDto) {
        console.log(user, 'UserData ======>>>>>>');
        
        return this.userService.createUser(user);
    }
}