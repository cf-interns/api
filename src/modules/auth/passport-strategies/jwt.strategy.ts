import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";
import { TokenPayload } from "../tokenPayload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies.Auth;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESSS_TOKEN_SECRET')
        })
        
    }


    async validate(payload: TokenPayload) {
        return this.userService.getById(payload.userId)
    }
}