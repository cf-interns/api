import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../domains/email.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import  EmailDto  from '../dtos/email.dto';
import { Application } from 'src/domains/application.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(Email)
        private readonly emailRepo: Repository<Email>,
        private readonly mailerService: MailerService,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>
    ) { }


    async getAllMails(appId: string): Promise<Email[]> {
        const allMails = await  this.emailRepo.find({
            relations: {author: true},
            where: {author: {_id: appId}}
        });

        if(!allMails) {
            throw new NotFoundException('Sorry No Emails Heave been Found!')
        }

        return allMails
    }

    async getMailById(emailId: string): Promise<Email> {
        const findThisMail = await this.emailRepo.findOne({
            where: {
                id: emailId
            }
        });

        if(!findThisMail) {
            throw new NotFoundException('Email Does Not Exist')
        };

        return findThisMail;
    }

    async sendMail(email: EmailDto, ) {
        let data = {
            to: email.to,
            from: email.from,
            subject: email.subject,
            text: email.text,
            
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

    async sendApplicationMail(email: EmailDto, appId: string,) {
        const app = await this.applicationRepo.findOne({where: {token: appId}})
            if (!app) {
                throw new HttpException('Application Not Found', HttpStatus.NOT_FOUND)
            }
            let data = {
                to: email.to,
                from: email.from,
                subject: email.subject,
                text: email.text,
                
            }
    
    
            try {
                let res = await this.mailerService.sendMail(data);
                let sentEmail = this.emailRepo.create({
                    to: res.envelope?.to,
                    from: res.envelope?.from,
                    text: data.text,
                    subject: data.subject,
                    author: app
                });
    
                await this.emailRepo.save(sentEmail);
                console.log(sentEmail, 'Email++++++');
                
                return { message: 'Email Success fully Sent!' }
            } catch (error) {
                console.log(error);
    
            }

            
        }

    async deleteEmail (emailId: string): Promise<object> {
        const deleteThisEmail = await this.emailRepo.delete(emailId);
        if (deleteThisEmail.affected === 0) {
            throw new NotFoundException('Email Not Found')
        }

        return {messagr: 'Email Deleted!'}
    }

    @Cron('45 * * * * *')
    async TestJob () {
        console.log('Cron Running!');
        
    }
}
