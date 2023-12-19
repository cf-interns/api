import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { PaginationParams } from "src/params/pagination.params";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags("notifications")
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

  @ApiOperation({
    summary: "Send an Email notification",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: EmailDto,
    status: 200,
    description: "SMS successfully sent",
  })
  @Post("send-email/:appToken")
  async sendEmail(
    @Body() emailDto: EmailDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.sendEmail(emailDto, appToken);
  }

  @ApiOperation({
    summary: "Send a Push notification",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: PushNotificationDto,
    status: 200,
    description: "Push  successfully sent",
  })
  // @HttpCode(405)
  @Post("send-push/:appToken")
  async sendPush(
    @Body() pushDto: PushNotificationDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.sendPush(pushDto, appToken);
  }

  @ApiOperation({
    summary: "Send an SMS notification",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: smsDto,
    status: 200,
    description: "SMS successfully sent",
  })
  @Post("send-sms/:appToken")
  async sendSms(@Body() smsDto: smsDto, @Param("appToken") appToken: string) {
    return this.notificationsService.sendSMS(smsDto, appToken);
  }

  @ApiOperation({
    summary: "Save an Email to be sent later at a specified data",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: CronEmailMessage,
    status: 200,
    description: "Success",
  })
  @Post("automatic-emails/:appToken")
  async sendMessage(
    @Body() emailDto: CronEmailMessage,
    @Param("appToken") appToken: string
  ) {
    console.log(emailDto, "DTO");
    console.log(appToken, "Token");

    return this.notificationsService.saveMessageToSendInCron(
      emailDto,
      appToken
    );
  }

  @ApiOperation({
    summary: "Save a Push Notification to be sent later at a specified data",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: PushNotificationDto,
    status: 200,
    description: "Success",
  })
  @Post("automatic-push/:appToken")
  async sendPushMessage(
    @Body() message: PushNotificationDto,
    @Param("appToken") appToken: string
  ) {
    return this.notificationsService.savePushMessageToSendInCron(
      message,
      appToken
    );
  }

  @ApiOperation({
    summary: "Save an Sms to be sent later at a specified data",
    parameters: [
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    type: smsDto,
    status: 200,
    description: "Success",
  })
  @Post("automatic-sms/:appToken")
  async sendAutomaticSMS(
    @Body() smsDto: smsDto,
    @Param("appToken") appToken: string
  ) {
    console.log(smsDto, "DTO");
    console.log(appToken, "Token");
    return this.notificationsService.saveSmsToSendInCron(smsDto, appToken);
  }

  @ApiOperation({
    summary: "Get all Notifications scheduled to be sent in future",
    description: "This endpoint returns all pending notifications",
  })
  @ApiResponse({
    // type: EmailDto,
    status: 200,
    description: "Success",
  })
  @HttpCode(200)
  @Get("auto-msg")
  getMessages() {
    return this.notificationsService.searchCronMessages();
  }

  @ApiOperation({
    summary:
      "Get all notifications in database irrespective of notification tyoe & status",
  })
  @Get("all-notifications")
  async getAllNotifs() {
    return this.notificationsService.getAllNotificationsInRepo();
  }

  @ApiOperation({
    summary: "Get all Notifications for an Application",
    description:
      "This endpoint returns all successful notifications sent by a specific Application. Notifications can also be filtered by type, status and specific search term in the body of the notification",
    parameters: [
      {
        name: "search",
        in: "query",
        description:
          "The specific search term in the notification body to be returned",
      },
      {
        name: "notification_type",
        in: "query",
        description:
          "This parameter filters the notifications and returns only the type specified",
      },
      {
        name: "status",
        in: "query",
        description:
          "This parameter filters the notifications and returns only the status specified",
      },
      {
        name: "offset",
        in: "query",
        description:
          "The number of notifications rows in the databse to be skipped and returned by the api",
      },
      {
        name: "limit",
        in: "query",
        description: "The number of notifications to be returned by the api",
      },
      {
        name: "appToken",
        in: "path",
        description:
          "The unique Application token used to identify and associate notifications to a specific app",
        required: true,
      },
    ],
  })
  @ApiResponse({
    // type: EmailDto,
    status: 200,
    description: "Success",
  })
  @HttpCode(200)
  @Get("all-notifications/:appToken")
  async getNotifications(
    @Query() filterDto: GetNotificationsFilterDto,
    @Query() { offset, limit }: PaginationParams,

    @Param("appToken") appToken: string
  ) {
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
        // appToken,
        offset,
        limit
      );
    } else {
      this.logger.log("Straight to All Notifications Service");

      return this.notificationsService.getAllNotification(
        appToken,
        offset,
        limit
      );
    }
  }

  @ApiOperation({
    summary: "Get a specific notification",
    parameters: [
      {
        name: "notificationId",
        in: "path",
        description: "Returns a specific notification with associated data",
      },
    ],
  })
  @Get(":notificationId")
  async getSpecificNotification(
    @Param("notificationId") notification_id: string
  ) {
    return this.notificationsService.getSpecificNotification(notification_id);
  }

  @ApiOperation({
    summary: "Deletes a specific notification",
    parameters: [
      {
        name: "notificationId",
        in: "path",
      },
    ],
  })
  @Delete(":notificationId")
  async deleteNotifications(@Param("notificationId") notification_id: string) {
    return this.notificationsService.deleteNotification(notification_id);
  }
}
