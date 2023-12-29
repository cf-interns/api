import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import {CronJob} from 'cron';
import { Message } from "src/domains/message.entity";
import { Repository } from "typeorm";
// import { SmsService } from "./sms.service";
import { smsDto } from "src/dtos/sms.dto";
import EmailDto from "src/dtos/email.dto";
import { EmailService } from "./email.service";
// import PushNotificationsService from "./pushNotification.service";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { Logger } from "@nestjs/common";
import { ApplicationService } from "./application.service";

@Injectable()
export class MessageService {
    private logger = new Logger('MessageService', {timestamp: true});            
    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        @InjectRepository(Message)
        private readonly MessageRepo: Repository<Message>,
        // private readonly Sms: SmsService,
        private readonly Email: EmailService,
        // private readonly Push: PushNotificationsService,
        private readonly App: ApplicationService,
        ) {}

    // async sendSMSMessage(sms:smsDto, appId: string) {

    //   const app = this.App.getAppByToken(appId);

    //   if ((await app).status !== 'INACTIVE') {
        
    //     try {

    //         const job = new CronJob('* * * * *',async () => {
    //             this.logger.log('Send-Sms Job Running')
    //             this.Sms.sendSms(sms, appId)
    //             const saveMessage = this.MessageRepo.create(sms);
    //             await this.MessageRepo.save(saveMessage);
                
    //         });
    
    //         this.schedulerRegistry.addCronJob('send-sms', job);
    //         job.start();
    //     } catch (error) {
    //         this.logger.error(`Failed to create SMS Job for application "${appId}", Dto: ${JSON.stringify(sms)}`, error.stack)
    //         throw new InternalServerErrorException('An internal error occured while creating a Job for sending SMS');
    //     }
    //   }

    //   throw new HttpException('Please Activate Your App', HttpStatus.UNAUTHORIZED)
    // //    return {message: 'Please Activate Your App'}

    
    // }


    async sendEmailMessageByMinute( minute: number,  mail: EmailDto, appId: string){

        const isAppActive = await this.App.getAppByToken(appId);

        if (isAppActive.status !== 'INACTIVE') {
            
        try {

            const emailJob = new CronJob(`${minute} * * * *`, async () => {
    
                const mail2 =   await this.Email.sendApplicationMail(mail, appId)
        
             
                const saveEmail = this.MessageRepo.create(mail);
                 this.MessageRepo.save(saveEmail);
                 this.logger.log(`Send-Email Job Running!`)
                // console.log('Send-Email Job Running');
                
                
            })
    
            this.schedulerRegistry.addCronJob('Send-Email', emailJob);
            emailJob.start();
                
            } catch (error) {
                
                throw new InternalServerErrorException('An Internal Error occured while creating a Job for sending email(s)')
            }
        }


      throw new HttpException('Please Activate Your App', HttpStatus.UNAUTHORIZED)
        
        
    }
/* 
    async sendPushByHour( minute:number, push:PushNotificationDto, appId:string) {

        const verifyApp = await this.App.getAppByToken(appId);
        if (verifyApp.token !== 'INACTIVE') {
            try {
            
                const jobs = new CronJob(`${minute} * * * * *`, async () => {
                    await this.Push.sendMessage(push, appId);
                    const savePush = this.MessageRepo.create(push);
                    await this.MessageRepo.save(savePush);
                    this.logger.log(`Send Push Notification Job Running!`)
                 //    console.log('Send Push Notification  Job Running!');
                    
                 })
         
                 this.schedulerRegistry.addCronJob('send-push', jobs);
                 jobs.start()
                } catch (error) {
                    this.logger.log(`An error occured while sending a push Notification`);
                    throw new InternalServerErrorException('Internal Error')
                }
        }

      throw new HttpException('Please Activate Your App', HttpStatus.UNAUTHORIZED)

        
    } */

    async deleteCron(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.log(`${name} Job Deleted!`)
        // console.log(`${name} job deleted!`);
        
    }

    async getAllCrons() {
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((val, key, map) => {
            let next;

            try {
                next = val.nextDates().toJSDate();
            } catch (error) {
                next = 'error: next fire date is in the past!';
            }

            this.logger.log(`Job: ${key} ==> next: ${next}`)
            // console.log(`Job: ${key} ==>> next: ${next}`);
            
        })
    }

    async getSpecificCron(name: string) {
        const jobs = this.schedulerRegistry.getCronJob(name);
        const next = jobs.nextDate().toJSDate();
        this.logger.log(`${name} Job: to run at ${next}`)
        // console.log(`Job: to run at ${next}`);
        
    }




}