import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './email.dto';

@Controller('email')
export class EmailController {

    constructor(
        private readonly emailService: EmailService
    ) {}

    @Post()
    sendEmail(@Body() emailDto: EmailDto, mailTo: string) {
        this.emailService.sendMail(emailDto, mailTo);
    }
}
