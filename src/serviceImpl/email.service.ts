import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../domains/email.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import  EmailDto  from '../dtos/email.dto';
import { Application } from 'src/domains/application.entity';
import { ApplicationService } from './application.service';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EmailService {
    private logger = new Logger('EmailService', {timestamp: true})
    constructor(
        @InjectRepository(Email)
        private readonly emailRepo: Repository<Email>,
        private readonly mailerService: MailerService,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        private appService: ApplicationService
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
        this.logger.log(`Email with id ${emailId} found. Email: ${findThisMail}`)
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
            this.logger.log('An error occured while trying to send an email', error.stack)
            throw new InternalServerErrorException('Internal Server Error')
        }
    }

    async sendApplicationMail(email: EmailDto, appId: string,) {
        const app = await this.appService.getAppByToken(appId)
         
        if(app.status === 'INACTIVE') {

            throw new HttpException('Please Activate Your Application', HttpStatus.UNAUTHORIZED)
        };
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
                // console.log(sentEmail, 'Email++++++');
                
                return { message: 'Email Success fully Sent!' }
            } catch (error) {

                this.logger.log('An Error Occured while trying to send an email', error.stack)
                throw new InternalServerErrorException(`An Error occured`,)
                // console.log(error);
    
            }

            
        }

    async deleteEmail (emailId: string): Promise<object> {
        const deleteThisEmail = await this.emailRepo.delete(emailId);
        if (deleteThisEmail.affected === 0) {
            throw new NotFoundException('Email Not Found')
        }
        this.logger.log(`Email Deleted!`)
        return {messagr: 'Email Deleted!'}
    }

}
