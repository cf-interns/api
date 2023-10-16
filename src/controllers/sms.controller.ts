import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { smsDto } from "src/dtos/sms.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { SmsService } from "src/serviceImpl/sms.service";

@ApiTags('sms')
@Controller('sms')
export default class SmsController {
    constructor (
        private readonly Smsservice: SmsService
    ) {}

    @ApiOperation({summary: 'Send An SMS'})
    @ApiResponse({type: smsDto, status: 200, description: 'SMS successfully sent'})
    @UseGuards(JwtAuthGuard)
    @Post('sendsms') 
    async sendsms(@Body() sms: smsDto) {
        return this.Smsservice.sendSms(sms);
    }
}