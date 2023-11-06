import EmailDto from "src/dtos/email.dto";
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import {
  AUTOMATIC_NOTIFICATIONS_QUEUE,
  NOTIFICATIONS_PROCESS,
  NOTIFICATIONS_PROCESS_SMS,
} from "src/common/constants";
import { NotificationsService } from "src/serviceImpl/notifications.service";

@Injectable()
@Processor(AUTOMATIC_NOTIFICATIONS_QUEUE)
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly _notificationService: NotificationsService,
    private readonly _configService: ConfigService
  ) {}

  @Process(NOTIFICATIONS_PROCESS)
  public async sendEmailCron(job: Job<any>) {
    try {
      console.log("hello");

      this.logger.log(
        `EmailDto in NOTIFICATION_PROCESS: ${JSON.stringify(job.data)} `
      );
      const email = {
        text: job.data.body,
        to: job.data.recipient,
        subject: job.data.subject,
        from: job.data.sent_by,
      };
      return this._notificationService.sendEmail(job.data, job.data.appToken);
    } catch (error) {
      this.logger.error(
        `Failed to send automatic email notification '${job.data}'`
      );
    }
  }

  @Process(NOTIFICATIONS_PROCESS_SMS)
  public async sendSMSCron(job: Job<any>) {
    try {
      this.logger.log(
        `SMS Dto in NOTIFICATION_PROCESS_SMS: ${JSON.stringify(job.data)} `
      );
    return this._notificationService.sendSMS(job.data, job.data.appToken);
      
    } catch (error) {
       this.logger.error(
         `Failed to send automatic sms notification '${job.data}'`
       );
    }
  }

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, eror: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${eror.message}`,
      eror.stack
    );
  }
}
