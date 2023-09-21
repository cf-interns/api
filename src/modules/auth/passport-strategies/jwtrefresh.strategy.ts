import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../../../services/tokenPayload.interface";
import { UserService } from "src/serviceImpl/user.service";




@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => { return req?.cookies?.Refresh }]),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.refresh'),
            passReqToCallback: true
        })
    }


    async validate(req: Request, payload: TokenPayload) {
        const refreshToken = req.cookies?.Refresh;
        return this.usersService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    }
}