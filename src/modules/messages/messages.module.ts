import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageController } from "src/controllers/message.controller";
import { Message } from "src/domains/message.entity";
import { MessageService } from "src/serviceImpl/message.service";
import SmsModule from "../sms/sms.module";
import { EmailModule } from "../email/email.module";
import PushNotificationsModule from "../pushNotifications/pushnotification.module";

@Module({
    imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Message]), SmsModule, EmailModule, PushNotificationsModule],
    controllers: [MessageController],
    providers: [MessageService]
})
export  class MessageModule {}
