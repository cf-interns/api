import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { getMessaging } from 'firebase-admin/messaging';
import { error } from "console";
import PushNotificationsService from "src/serviceImpl/pushNotification.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { GetUser } from "src/decorators/user.decorator";
import { User } from "src/domains/user.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('push notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)


export default class PushNotificationsController {

    constructor(
        private readonly pushNotificationService: PushNotificationsService
    ) { }

    @Get('all-notifications/:application_id')
    async getAllNotifications(@Param('application_id') app_id: string) {
        return this.pushNotificationService.getAllPushNotifications(app_id)
    }


    @Get('application/:id')
    async getNotificationById(@Param('id') notification_id: string) {
        return this.pushNotificationService.getPushNotificationById(notification_id)
    }

    @HttpCode(200)
    @Post('send-notification/:application_id')
    async sendMessage(@Body() message: PushNotificationDto, @Param('application_id') application_id: string, @GetUser() user: User) {
        console.log(user);
        
        return this.pushNotificationService.sendMessage(message, application_id)
    }

    @Delete('application/:id')
    async deleteNotification(@Param('id') notification_id: string) {
        return this.pushNotificationService.deletePushNotification(notification_id)
    }
}