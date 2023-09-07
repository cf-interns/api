import { Body, Controller, HttpCode, Post, Req,Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDataDto } from "src/dtos/reister.dto";
import RequestObjectWithUser from "./requestWithUser.interface";
import { LocalAuthGuard } from "src/guards/localAuth.guard";
import { Response } from "express";


@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}

    @Post('sign_up')
    async register(@Body() signUpUser: RegisterDataDto) {
        // console.log(signUpUser, "===> User");
        
        return this.authService.register(signUpUser);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('sign_in')
    async login(@Req() req: RequestObjectWithUser,) {
        const {user} = req;

      const cookie = this.authService.getCookieWithToken(user._id);
        req.res.setHeader('Set-Cookie', cookie);
        //local serialization
        user.password = undefined;

        return user;
    };

    

    @Post('log-out')
    async logOut(@Req() req: RequestObjectWithUser, @Res() res) {
        res.setHeader('Set-Cookie', this.authService.removeCookieForLogOut());
        return res.sendStatus(200);
    }
}