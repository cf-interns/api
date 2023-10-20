import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import {CronJob} from 'cron';
import { Message } from "src/domains/message.entity";
import { Repository } from "typeorm";
import { SmsService } from "./sms.service";
import { smsDto } from "src/dtos/sms.dto";
import EmailDto from "src/dtos/email.dto";
import { EmailService } from "./email.service";
import PushNotificationsService from "./pushNotification.service";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";

@Injectable()
export class MessageService {

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        @InjectRepository(Message)
        private readonly MessageRepo: Repository<Message>,
        private readonly Sms: SmsService,
        private readonly Email: EmailService,
        private readonly Push: PushNotificationsService
        ) {}

    async sendSMSMessage(sms:smsDto, appId: string) {

        const job = new CronJob('* * * * *',async () => {
            this.Sms.sendSms(sms, appId)
            console.log('Send-SMS Job running!');
            const saveMessage = this.MessageRepo.create(sms);
            await this.MessageRepo.save(saveMessage);
            
        });

        this.schedulerRegistry.addCronJob('send-sms', job);
        job.start();
    }


    async sendEmailMessageByMinute( minute:number,  mail: EmailDto, appId: string){
        
        
        const emailJob = new CronJob(`${minute} * * * *`, async () => {

            const mail2 =   await this.Email.sendApplicationMail(mail, appId)
    
         
            const saveEmail = this.MessageRepo.create(mail);
             this.MessageRepo.save(saveEmail);
            console.log('Send-Email Job Running');
            
            
        })

        this.schedulerRegistry.addCronJob('Send-Email', emailJob);
        emailJob.start();
    }

    async sendPushByHour( minute:number, push:PushNotificationDto, appId:string) {
        const jobs = new CronJob(`${minute} * * * * *`, async () => {
           await this.Push.sendMessage(push, appId);
           const savePush = this.MessageRepo.create(push);
           await this.MessageRepo.save(savePush);
           console.log('Send Push Notification  Job Running!');
           
        })

        this.schedulerRegistry.addCronJob('send-push', jobs);
        jobs.start()
    }

    async deleteCron(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
        console.log(`${name} job deleted!`);
        
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

            console.log(`Job: ${key} ==>> next: ${next}`);
            
        })
    }

    async getSpecificCron(name: string) {
        const jobs = this.schedulerRegistry.getCronJob(name);
        const next = jobs.nextDate().toJSDate();
        console.log(`Job: to run at ${next}`);
        
    }




}