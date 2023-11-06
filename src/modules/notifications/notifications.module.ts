import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import Notification from "src/domains/notifications.entity";
import { ApplicationModule } from "../application/application.module";
import { NotificationController } from "src/controllers/notification.controller";
import { NotificationsService } from "src/serviceImpl/notifications.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { BullModule } from "@nestjs/bull";
import { AUTOMATIC_NOTIFICATIONS_QUEUE } from "src/common/constants";
import { NotificationsProcessor } from "src/processors/notification.processor";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>("http.timeout"),
        maxRedirects: configService.get<number>("http.redirects"),
      }),
      inject: [ConfigService],
    }),
    ApplicationModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("GOOGLE_MAIL_HOST"),
          secure: true,
          logger: true,
          debug: true,
          auth: {
            user: configService.get("GOOGLE_EMAIL_USER"),
            pass: configService.get("GOOGLE_EMAIL_PASS"),
          },
          tls: {
            rejectUnauthorized: true,
          },
          defaults: {
            from: configService.get("GOOGLE_DEFAULT_MAIL"),
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("REDIS_HOST"),
          port: +configService.get<number>("REDIS_PORT"),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: AUTOMATIC_NOTIFICATIONS_QUEUE,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationController],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [],
})
export class NotifcationsModule {}
