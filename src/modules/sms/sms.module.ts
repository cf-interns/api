import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import SmsController from "src/controllers/sms.controller";
import { Sms } from "src/domains/sms.entity";
import { SmsService } from "src/serviceImpl/sms.service";


@Module({
    imports: [TypeOrmModule.forFeature([Sms]), HttpModule],
    controllers: [SmsController],
    providers: [SmsService],
})
export default class SmsModule {}