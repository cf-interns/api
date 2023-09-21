import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../domains/email.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from '../dtos/email.dto';

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(Email)
        private readonly emailRepo: Repository<Email>,
        private readonly mailerService: MailerService
    ) { }


    async sendMail(email: EmailDto, mail: string) {
        let data = {
            to: mail,
            from: 'no-reply@payunit.net',
            subject: 'Test Password Reset Token',
            text: email.text
        }


        try {
            let res = await this.mailerService.sendMail(data);
            let sentEmail = this.emailRepo.create({
                to: res.envelope?.to,
                from: res.envelope?.from,
                text: data.text,
                subject: data.subject
            });

            await this.emailRepo.save(sentEmail);
            return { message: 'Please check your inbox for further instructions' }
        } catch (error) {
            console.log(error);

        }
    }
}
