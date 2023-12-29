import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "src/serviceImpl/auth.service";


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private readonly authService: AuthService) {
        super({header: 'api-Key', prefix: ''}, true, async (apikey, done) => {
            if (this.authService.validateApiKey(apikey)) {
                done(null, true)
            };

            done(new UnauthorizedException(), null)
        })
    }
}