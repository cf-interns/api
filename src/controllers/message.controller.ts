import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import EmailDto from "src/dtos/email.dto";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { smsDto } from "src/dtos/sms.dto";
import { MessageService } from "src/serviceImpl/message.service";

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService,


    ) { }

    @Get('cron/:cron_name')
    async getCron(@Param() name: string) {
        return this.messageService.getSpecificCron(name);
    }

    @Get('all-crons')
    async getAllCrons() {
        return this.messageService.getAllCrons();
    }


    @Post('/sms/:application_id')
    async sendSMSMessage(@Body() sms: smsDto, @Param('application_id') appId: string) {

        try {
        return this.messageService.sendSMSMessage( sms, appId)
            
        } catch (error) {
            return error
        }
    }

    @Post('/email/:application_id')
    async sendEmail(@Body() mail: EmailDto, @Param('application_id') appId: string) {
        try {
            
        return this.messageService.sendEmailMessageByMinute( 10, mail, appId)

        } catch (error) {
            console.log(error);
            
        }
    }

    @Post('/push/:application_id')
    async sendPush(@Body() push1: PushNotificationDto, @Param('application_id') appId: string) {
        return this.messageService.sendPushByHour( 55, push1, appId)
    }

    @Delete(':cron_name')
    deleteCron(@Param('cron_name') name: string) {
        return this.messageService.deleteCron(name);
    }
}