import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { UserService } from "../serviceImpl/user.service";
import { User } from "../domains/user.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiSecurity } from "@nestjs/swagger";

@ApiTags('users')

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }



    @Get(':id')
    async getUserById(@Param('id') _id: string): Promise<User> {
        return this.userService.getById(_id);
    }

    @ApiOperation({ summary: 'Gets all registered users', description: 'If you want to get all users with their created apps, use this route. This route is protected and only admins can access it. It takes no path or query params' })
    @ApiResponse({
        // type: ,
        status: 200,
        description: 'All the registered users'
    })
    @UseGuards(JwtAuthGuard)
    @ApiSecurity('Auth-token')
    @Get()
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