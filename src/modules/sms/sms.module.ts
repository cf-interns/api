import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "src/app.module";
import SmsController from "src/controllers/sms.controller";
import { Application } from "src/domains/application.entity";
import { Sms } from "src/domains/sms.entity";
import { SmsService } from "src/serviceImpl/sms.service";
import { ApplicationModule } from "../application/application.module";


@Module({
    imports: [TypeOrmModule.forFeature([Sms, Application]), HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory:async (configService:ConfigService) => ({
            timeout: configService.get<number>('http.timeout'),
            maxRedirects: configService.get<number>('http.redirects')
        }),
        inject: [ConfigService]
    }), ApplicationModule],
    controllers: [SmsController],
    providers: [SmsService],
    exports: [SmsService]
})
export default class SmsModule {}