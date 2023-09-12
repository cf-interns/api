import { Body, Controller, HttpCode,Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDataDto } from "src/dtos/reister.dto";
import RequestObjectWithUser from "./requestWithUser.interface";
import { LocalAuthGuard } from "src/guards/localAuth.guard";
import { Response } from "express";
import { LoginDto } from "src/dtos/login.dto";
import { UserService } from "../user/user.service";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Get('refresh')
    refresh(@Req() req: RequestObjectWithUser) {
        const accessTokenCookie = this.authService.getCookieWithToken(req.user?._id);
        req.res.setHeader('Set-Cookie', accessTokenCookie);
        return req.user

    }

    @Post('sign_up')
    async register(@Body() signUpUser: RegisterDataDto) {
        // console.log(signUpUser, "===> User");
        console.log(signUpUser);

        return this.authService.register(signUpUser);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('sign_in')
    async login(@Req() req: RequestObjectWithUser, @Body() loginData: LoginDto) {
        const { user } = req;
 
        const acessTokenCookie = this.authService.getCookieWithToken(user._id);
        // const refreshTokenCookie = this.authService.getCookieWithRefreshToken(user._id);
 

        const {cookie: refreshTokenCookie, refresh_token:refresh_token} = this.authService.getCookieWithRefreshToken(user._id)
        await this.userService.setCurrentRefreshToken(refreshTokenCookie, user._id);

        req.res.setHeader('Set-Cookie', [acessTokenCookie, refreshTokenCookie]);
        //local serialization
        user.password = undefined;
        return user;
    };



    @Post('log-out')
    async logOut(@Req() req: RequestObjectWithUser, @Res() res) {
        await this.userService.removeRefreshToken(req.user._id);
        req.res.setHeader('Set-Cookie', this.authService.removeCookieForLogOut())
        return res.sendStatus(200);
    }
}