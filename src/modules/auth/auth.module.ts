import { Module } from "@nestjs/common";
import { AuthController } from "../../controllers/auth.controller";
import { AuthService } from "../../serviceImpl/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./passport-strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./passport-strategies/jwt.strategy";
import { ApiKeyStrategy } from "./passport-strategies/apiKey.strategy";


@Module({
    imports: [UserModule, PassportModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({

            secret: configService.get<string>("jwt.secret"),
            signOptions: {
                expiresIn: `${configService.get<number>("jwt.expTime")}s`
            }

        })
    }), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, ApiKeyStrategy]
})
export class AuthModule { }