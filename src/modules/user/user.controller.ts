import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { ValidationPipe } from "@nestjs/common";


@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('all-users')
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    //  @UsePipes(ValidationPipe)
  /*   @Post('sign_up')
    async createUser(@Body() user: CreateUserDto) {
        console.log(user, 'UserData ======>>>>>>');

        return this.userService.createUser(user);
    } */
}