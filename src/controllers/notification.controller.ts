import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CronEmailMessage } from "src/dtos/cronEmail.dot";
import EmailDto from "src/dtos/email.dto";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { smsDto } from "src/dtos/sms.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { NotificationsService } from "src/serviceImpl/notifications.service";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
  private logger = new Logger("notificationsController");

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("send-email/:appId")
  async sendEmail(
    @Body() emailDto: EmailDto,
    @Param("appId") appToken: string
  ) {
    return this.notificationsService.sendEmail(emailDto, appToken);
  }

  @Post("send-push/:appId")
  async sendPush(
    @Body() pushDto: PushNotificationDto,
    @Param("appId") appToken: string
  ) {
    return this.notificationsService.sendPush(pushDto, appToken);
  }

  @Post("send-sms/:appId")
  async sendSms(@Body() smsDto: smsDto, @Param("appId") appToken: string) {
    return this.notificationsService.sendSMS(smsDto, appToken);
  }

  @Post("automatic-emails/:appToken")
  async sendMessage(
    @Body() emailDto: CronEmailMessage,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.saveMessageToSendInCron(emailDto, appToken);
  }

  @Post('automatic-sms/:appToken')
  async sendAutomaticSMS(
    @Body() smsDto: smsDto,
    @Param('appToken') appToken: string 
  ){
    return this.notificationsService.saveSmsToSendInCron(smsDto, appToken);
  }

  @Get('auto-msg')
  getMessages(){
    return this.notificationsService.searchCronMessages();
  }

  @Get("all-notifications/:appToken")
  async getNotifications(@Param("appToken") appId) {
    return this.notificationsService.getAllNotification(appId);
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
