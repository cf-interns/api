import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { UserService } from "../serviceImpl/user.service";
import { User } from "../domains/user.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiSecurity, ApiBody } from "@nestjs/swagger";
import RequestObjectWithUser from "src/services/requestWithUser.interface";
import { ForgotPasswordDto } from "src/dtos/createPassword.dto";
import { ResetPasswordDto } from "src/dtos/restPassword.dto";
import { ChangePasswordDto } from "src/dtos/changePassword.dto";

@ApiTags('users')

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }


    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserById(@Req()  req: RequestObjectWithUser): Promise<User> {
        return this.userService.getById(req.user._id);
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


    // @ApiTags('passwords')
    @ApiOperation({ summary: 'Forgot Password', description: 'A user can make a request to this route in case they forget their passord. An email will be sent to the user with further instructions' })
    @ApiResponse({
        type: ForgotPasswordDto,
        status: 200,
        description: 'Please Check your email'
    })
    @ApiBody({
        type: ForgotPasswordDto,
        description: 'Email sent with a url containing a token'
    })
    @HttpCode(200)
    @Post('passwords/forgot-password')
    forgotPassword(@Body() email: ForgotPasswordDto) {
        // console.log(email.email);


        return this.userService.createPassword(email)
    }


    @ApiOperation({ summary: 'Password reset', description: 'A user can request a password reset using this route' })
    @ApiBody({ type: ResetPasswordDto, description: 'User should enter new password and also confirm this new password to reset previous password, most importantly they user has to provide the token sent to their email' })
    @ApiResponse({ description: 'The email contains a link with a url having a token which will be used for resetting their password' })
    @Post('passwords/reset-password')
    restPassword(@Body() pass: ResetPasswordDto) {

        return this.userService.resetPassword(pass);
    }


    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Password reset', description: 'A user can request a password reset using this route' })
    @ApiBody({ type: ChangePasswordDto, description: 'User should enter current password to change password.' })
    @ApiResponse({ description: 'In order to change the user must be authenticated since this endpoint is protected' })
    @Post('change-password')
    changePassword(@Req() req: RequestObjectWithUser,@Body() changePasswordDto: ChangePasswordDto) {
        console.log(changePasswordDto.oldPassword, '++++++++++');
        
        return this.userService.changePassword(req.user._id,changePasswordDto);
    }

}