import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { ForgotPasswordDto } from '../dtos/createPassword.dto';
import { PasswordService } from '../serviceImpl/password.service';
import { ResetPasswordDto } from '../dtos/restPassword.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/dtos/changePassword.dto';
import { UserService } from 'src/serviceImpl/user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
@ApiTags('passwords')
@Controller('passwords')
export class PasswordController {

    constructor(
        private readonly passwordService: PasswordService,
        private readonly userService: UserService
    ) { }

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
    @Post('forgot-password')
    forgotPassword(@Body() email: ForgotPasswordDto) {
        console.log(email.to);


        return this.passwordService.createPassword(email.to)
    }


    @ApiOperation({ summary: 'Password reset', description: 'A user can request a password reset using this route' })
    @ApiBody({ type: ResetPasswordDto, description: 'User should enter new password and also confirm this new password to reset previous password, most importantly they user has to provide the token sent to their email' })
    @ApiResponse({ description: 'The email contains a link with a url having a token which will be used for resetting their password' })
    @Post('reset-password')
    restPassword(@Body() pass: ResetPasswordDto) {

        return this.passwordService.resetPassword(pass);
    }



}
