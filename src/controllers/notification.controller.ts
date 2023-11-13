import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Sse,
  UseGuards,
} from "@nestjs/common";
import { Observable, fromEvent, interval, map } from "rxjs";
import { CronEmailMessage } from "src/dtos/cronEmail.dot";
import EmailDto from "src/dtos/email.dto";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { smsDto } from "src/dtos/sms.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { NotificationsService } from "src/serviceImpl/notifications.service";
// import { NotificationEvent } from "src/services/event.interface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import NotificationEvent from "src/services/event.interface";
import { GetNotificationsFilterDto } from "src/dtos/getNotifications-filter.dto";
import { object } from "joi";
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
  private logger = new Logger("notificationsController");

  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse("sse-events")
  sse(): Observable<NotificationEvent> {
    return interval(1000).pipe(
      map((num) => ({
        data: "hello" + num,
      }))
    );
  }

  @Post("send-email/:appToken")
  async sendEmail(
    @Body() emailDto: EmailDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.sendEmail(emailDto, appToken);
  }

  @Post("send-push/:appToken")
  async sendPush(
    @Body() pushDto: PushNotificationDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.sendPush(pushDto, appToken);
  }

  @Post("send-sms/:appToken")
  async sendSms(@Body() smsDto: smsDto, @Param("appToken") appToken: string) {
    return this.notificationsService.sendSMS(smsDto, appToken);
  }

  @Post("automatic-emails/:appToken")
  async sendMessage(
    @Body() emailDto: CronEmailMessage,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.saveMessageToSendInCron(
      emailDto,
      appToken
    );
  }

  @Post("automatic-sms/:appToken")
  async sendAutomaticSMS(
    @Body() smsDto: smsDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.saveSmsToSendInCron(smsDto, appToken);
  }

  @Get("auto-msg")
  getMessages() {
    return this.notificationsService.searchCronMessages();
  }

  @Get("all-notifications/:appToken")
  async getNotifications(
    @Query() filterDto: GetNotificationsFilterDto,

    @Param("appToken") appToken: string
  ) {
    //If any filters are defined, call NotificationsService.getNotificationsFilters else just get all notifications

    if (Object.keys(filterDto).length) {
      console.log(
        "appToken ====>>",
        appToken,
        "",
        "filterDto =====>>",
        filterDto.notification_type
      );

      this.logger.log("In Filter Service");
      return this.notificationsService.getNotificationsWithFilters(
        filterDto,
        appToken
      );
    } else {
      this.logger.log("Straight to All Notifications Service");

      return this.notificationsService.getAllNotification(appToken);
    }
  }

  @Get(":notificationId")
  async getSpecificNotification(
    @Param("notificationId") notification_id: string
  ) {
    return this.notificationsService.getSpecificNotification(notification_id);
  }

  @Delete(":notificationId")
  async deleteNotifications(@Param("notificationId") notification_id: string) {
    return this.notificationsService.deleteNotification(notification_id);
  }
}
