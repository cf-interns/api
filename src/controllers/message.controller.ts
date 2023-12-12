import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import EmailDto from "src/dtos/email.dto";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { smsDto } from "src/dtos/sms.dto";
import { MessageService } from "src/serviceImpl/message.service";
import { Logger } from "@nestjs/common";
import { GetUser } from "src/decorators/user.decorator";

@Controller('message')
export class MessageController {
    private logger = new Logger('MessageController')
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
        this.logger.verbose(`Application with id "${appId}" creating a Job for sending an SMS every minute"${JSON.stringify(sms)}"`)
        return this.messageService.sendSMSMessage( sms, appId)
            
        } catch (error) {
            return error
        }
    }

    @Post('/email/:application_id')
    async sendEmail(@Body() mail: EmailDto, @Param('application_id') appId: string) {
        try {
        this.logger.verbose(`Application with id "${appId}" creating a Job for sending an hour after 10 minutes "${JSON.stringify(mail)}"`)
            
        return this.messageService.sendEmailMessageByMinute( 10, mail, appId)

        } catch (error) {
            this.logger.log('An Error Occured', error.stack)
            
        }
    }

 /*    @Post('/push/:application_id')
    async sendPush(@Body() push1: PushNotificationDto, @Param('application_id') appId: string) {
        this.logger.verbose(`Application with id "${appId}" creating a Job for sending a push  every hour after 55 minutes "${JSON.stringify(push1)}"`)

        return this.messageService.sendPushByHour( 55, push1, appId)
    } */

    @Delete(':cron_name')
    deleteCron(@Param('cron_name') name: string) {
        this.logger.verbose(`Deleting The "${JSON.stringify(name)} Cron Job"`)

        return this.messageService.deleteCron(name);
    }
}