import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../serviceImpl/email.service';
import { EmailDto } from '../dtos/email.dto';

@Controller('email')
export class EmailController {

    constructor(
        private readonly emailService: EmailService
    ) { }

    @Post()
    sendEmail(@Body() emailDto: EmailDto, mailTo: string) {
        this.emailService.sendMail(emailDto, mailTo);
    }
}
