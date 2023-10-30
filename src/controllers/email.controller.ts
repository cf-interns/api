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
import { EmailService } from "../serviceImpl/email.service";
import EmailDto from "../dtos/email.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@ApiTags("emails")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({
    summary: "Get all Emails sent by an application",
    description:
      "This endpoint is protected and returns all the Emails a user has sent using this application",
  })
  @ApiResponse({
    type: EmailDto,
    status: 200,
    description: "Success",
  })
  @HttpCode(200)
  @Get("application/:application_id")
  async getAllMails(@Param("application_id") app_id: string) {
    return this.emailService.getAllMails(app_id);
  }

  @ApiOperation({ summary: "Get specific Notification" })
  @Get(":id")
  async getById(@Param("id") mail_id: string) {
    return this.emailService.getMailById(mail_id);
  }

  @Post()
  async sendEmail(@Body() emailDto: EmailDto) {
    return this.emailService.sendMail(emailDto);
  }

  @ApiOperation({ summary: "Send An Email" })
  @ApiResponse({
    type: EmailDto,
    status: 200,
    description: "Email successfully sent",
  })
  @UseGuards(JwtAuthGuard)
  @Post("send/:application_id")
  async sendMail(
    @Param("application_id") app_id: string,
    @Body() emailDto: EmailDto
  ) {
    return this.emailService.sendApplicationMail(emailDto, app_id);
  }

  @ApiOperation({
    summary: "Delete an Email",
    description:
      "An authenticated user can delete an Email by making a request to this endpoint.",
  })
  @Delete(":id")
  async deleteMail(@Param("id") mail_id: string) {
    return this.emailService.deleteEmail(mail_id);
  }
}
