import { Body, Controller, HttpCode, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../serviceImpl/auth.service";
import { RegisterDataDto } from "src/dtos/reister.dto";
import RequestObjectWithUser from "../services/requestWithUser.interface";
import { LocalAuthGuard } from "src/guards/localAuth.guard";
import { Response } from "express";
import { LoginDto } from "src/dtos/login.dto";
import { UserService } from "../serviceImpl/user.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@ApiTags('auth')

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }



    @ApiOperation({ summary: 'Get a new Token upon acess_token expiration', description: 'Replace acess-token with the new refresh token in the browser cookie to prove authorization for subsequent requests to the api' })
    @ApiResponse({
        // type: ,
        status: 200,
        description: 'User Validated'
    })
    @Get('refresh')
    @HttpCode(200)
    refresh(@Req() req: RequestObjectWithUser) {
        const accessTokenCookie = this.authService.getCookieWithToken(req.user?._id);
        req.res.setHeader('Set-Cookie', accessTokenCookie);
        return req.user

    }

    @ApiOperation({ summary: 'Sign up a user', description: 'Create a new user account' })
    @ApiResponse({
        type: RegisterDataDto,
        status: 201,
        description: 'Store User Data'
    })
    @Post('sign_up')
    async register(@Body() signUpUser: RegisterDataDto) {
        // console.log(signUpUser, "===> User");
        

        return this.authService.register(signUpUser);
    }



    @ApiOperation({ summary: 'Log in a user', description: 'Validate user and login if successful' })
    @ApiResponse({
        type: LoginDto,
        status: 200,
        // description: ''
    })
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('sign_in')
    async login(@Req() req: RequestObjectWithUser, @Body() loginData: LoginDto) {
        const { user } = req;

        const acessTokenCookie = this.authService.getCookieWithToken(user._id);
        // const refreshTokenCookie = this.authService.getCookieWithRefreshToken(user._id);


        const { cookie: refreshTokenCookie, refresh_token: refresh_token } = this.authService.getCookieWithRefreshToken(user._id)
        await this.userService.setCurrentRefreshToken(refresh_token, user._id);

        req.res.setHeader('Set-Cookie', [acessTokenCookie, refreshTokenCookie]);
        
        return user;
    };



    @ApiOperation({ summary: 'Logout a user', description: 'Remove user authentication token in the browser cookie' })
    @ApiResponse({
        status: 200,
        // description: ''
    })
    @UseGuards(JwtAuthGuard)
    @Post('log-out')
    async logOut(@Req() req: RequestObjectWithUser, @Res() res: any) {
    /*     const {user} = req
        console.log(user._id); */
        
        await this.userService.removeRefreshToken(req.user._id);
        req.res.setHeader('Set-Cookie', this.authService.removeCookieForLogOut())
        return res.sendStatus(200);
    }
}