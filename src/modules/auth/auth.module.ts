import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./passport-strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    imports: [UserModule, PassportModule,JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService:ConfigService)  => ({ 
            
            secret: configService.get('JWT_SECRET'),
            signOptions: {
                expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`
            }
            
        })
    })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy]
})
export class AuthModule {}