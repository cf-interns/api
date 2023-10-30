import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { smsDto } from "src/dtos/sms.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { SmsService } from "src/serviceImpl/sms.service";

@ApiTags("sms")
@Controller("sms")
@UseGuards(JwtAuthGuard)
export default class SmsController {
  constructor(private readonly Smsservice: SmsService) {}

  @ApiOperation({
    summary: "Get all sms sent by an application",
    description:
      "This endpoint is protected and returns all the SMS a user has sent using this application",
  })
  @ApiResponse({
    type: smsDto,
    status: 200,
    description: "Success",
  })
  @HttpCode(200)
  @Get("all-sms/:application_id")
  async getAllSms(@Param("application_id") app_id: string) {
    return this.Smsservice.getAllSms(app_id);
  }

  @ApiOperation({ summary: "Get specific sms" })
  @Get(":id")
  async getById(@Param("id") sms_id: string) {
    return this.Smsservice.getSmsById(sms_id);
  }

  @ApiOperation({ summary: "Send An SMS" })
  @ApiResponse({
    type: smsDto,
    status: 200,
    description: "SMS successfully sent",
  })
  @UseGuards(JwtAuthGuard)
  @Post("send/:application_id")
  async sendsms(@Body() sms: smsDto, @Param("application_id") sms_id: string) {
    return this.Smsservice.sendSms(sms, sms_id);
  }

  @ApiOperation({
    summary: "Delete an SMS",
    description:
      "An authenticated user can delete an SMS by making a request to this endpoint.",
  })
  @Delete(":id")
  async deleteSms(@Param() sms_id: string) {
    return this.Smsservice.deleteSms(sms_id);
  }
}
