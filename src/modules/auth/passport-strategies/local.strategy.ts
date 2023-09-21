import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "../../../serviceImpl/auth.service";
import { User } from "../../../domains/user.entity";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authService.loginUser(email, password);
    }
}