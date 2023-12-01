import {
  AUTOMATIC_NOTIFICATIONS_QUEUE,
  NOTIFICATIONS_PROCESS,
  NOTIFICATIONS_PROCESS_SMS,
} from "./../common/constants/index";
import { AxiosError } from "axios";
import { HttpService } from "@nestjs/axios";
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "src/domains/application.entity";
import Notification from "src/domains/notifications.entity";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { ApplicationService } from "./application.service";
import { smsDto } from "src/dtos/sms.dto";
import { catchError, firstValueFrom } from "rxjs";
import { error, log } from "console";
import EmailDto from "src/dtos/email.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { getMessaging } from "firebase-admin/messaging";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CronEmailMessage } from "src/dtos/cronEmail.dot";
import { DateTime } from "luxon";
import * as moment from "moment";
import { GetNotificationsFilterDto } from "src/dtos/getNotifications-filter.dto";

@Injectable()
export class NotificationsService {
  private logger = new Logger("NotificationsService");

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly appService: ApplicationService,
    private readonly mailerService: MailerService,
    @InjectQueue(AUTOMATIC_NOTIFICATIONS_QUEUE)
    private readonly automaticNotificationsQueue: Queue
  ) {}

  async sendSMS(sms: smsDto, appToken: string): Promise<object> {
    const app = await this.appService.getAppByToken(appToken);
    const getNotification = this.notificationsRepo.findOne({
      where: {
        _id: sms._id,
        notification_type: "AUTOMATIC",
        status: "PENDING",
      },
    });

    if (app.status !== "ACTIVE") {
      throw new HttpException(
        "Please Activate Your Application",
        HttpStatus.UNAUTHORIZED
      );
    }

    const url = this.configService.get<string>("nexah.url");

    const gnsAuth = {
      user: this.configService.get<string>("nexah.user"),
      password: this.configService.get<string>("nexah.password"),
      senderId: this.configService.get<string>("nexah.senderId"),
      sms: sms.message,
      mobiles: sms.mobiles,
    };

    const headerReq = {
      "Content-Type": "application/json; charset=UTF-8",
    };

    if (!getNotification) {
      return { message: "No New Messages!" };
    }

    try {
      const res = await firstValueFrom(
        this.httpService
          .get(url, {
            params: gnsAuth,
            headers: headerReq,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw new HttpException(
                "An Error Occured!",
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );

      const smsResult = res.data.sms;

      function extractInfo(arr: any[], prop: string) {
        let extratedValue = arr.map((i) => i[prop]);

        let genVal = extratedValue[0]; //TODO: format data to extract entire array

        return genVal;
      }

      if (sms.token) {
        if (getNotification) {
          return this.changeCronStatus(sms._id);
        }
        this.logger.log(`Gotcha :) Cron SMS with token ${sms.token} found!`);
      }

      const smsToSave = this.notificationsRepo.create({
        status: extractInfo(smsResult, "status"),
        body: sms.message,
        provider: "Nexah",
        recipient: sms.mobiles,
        author: app,
        request_data: JSON.stringify(sms),
        response_data: extractInfo(smsResult, "errordescription"),
        external_id: extractInfo(smsResult, "messageid"),
        sent_by: app.appName,
        notification_type: "SMS",
      });

      if (smsToSave.status === "success" && smsToSave.response_data === null) {
        await this.notificationsRepo.save(smsToSave);
        return { message: "SMS successfully sent" };
      } else {
        const message = smsToSave.response_data;
        return { message };
      }
    } catch (error) {
      this.logger.error(`Error while sending SMS`, error.stack);
    }
  }

  async sendEmail(email: EmailDto, appToken: string): Promise<object> {
    this.logger.log(`EmailDTO in sendEmail: ${JSON.stringify(email)}`);

    const getNotification = this.notificationsRepo.findOne({
      where: {
        _id: email._id,
        notification_type: "AUTOMATIC",
        status: "PENDING",
      },
    });

    try {
      const app = await this.appService.getAppByToken(appToken);

      if (app.status === "INACTIVE") {
        throw new HttpException(
          "Please Activate Your Application",
          HttpStatus.UNAUTHORIZED
        );
      }

      let data = {
        to: email.to,
        from: email.from,
        subject: email.subject,
        text: email.text,
      };
      this.logger.log(`Email Address: ${data.to}`);

      if (!getNotification) {
        return { message: "No New Messages!" };
      }
      let result = await this.mailerService.sendMail(data);
      console.log(result, "SEND EMAIL RESULT");

      //On Success get notification and update status to success!
      //If notifiaction change status and break code execution

      if (email.token) {
        if (getNotification) {
          return this.changeCronStatus(email._id);
        }
        this.logger.log(
          `Gotcha :) Cron Email with token ${email.token} found!`
        );
      }

      let sentEmail = this.notificationsRepo.create({
        recipient: data.to,
        author: app,
        sent_by: result.envelope?.from,
        body: data.text,
        subject: data.subject,
        provider: "GMAIL",
        status: "SUCCESS",
        request_data: JSON.stringify(data),
        notification_type: "EMAIL",
      });

      await this.notificationsRepo.save(sentEmail);
      console.log("Saved Entity Auhor??? in db!", sentEmail.author);
    } catch (error) {
      this.logger.log(
        "An Error Occured while trying to send an email",
        error.stack
      );
      throw new InternalServerErrorException(`An Error occured`);
    }
    return { message: "Email Successfully Sent" };
  }

  async sendPush(
    message: PushNotificationDto,
    appToken: string
  ): Promise<object> {
    const app = await this.appService.getAppByToken(appToken);

    if (app.status !== "ACTIVE") {
      throw new HttpException(
        "Please Activate Your Application",
        HttpStatus.UNAUTHORIZED
      );
    }

    getMessaging()
      .send(message)
      .then(async (res) => {
        const savePushMessage = await this.notificationsRepo.create({
          title: message.notification.title,
          body: message.notification.body,
          author: app,
          status: "success",
          provider: "FCM",
          notification_type: "PUSH",
        });

        await this.notificationsRepo.save(savePushMessage);
        this.logger.log(`Notification Successfully Sent ${res}`);
      })
      .catch((error) => {
        this.logger.log(`An error occured while sending push`, error.stack);

        throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
      });

    return { message: "Push Successfully Sent!" };
  }

  async getAllNotificationsInRepo(){
    return this.notificationsRepo.find()
  } 

  // All Notifications of a specific app
  async getAllNotification(appToken: string, offset?: number, limit?: number) {
    console.log(appToken, "APP TOKEN");

    const [notifications, count] = await this.notificationsRepo.findAndCount({
      where: {
        author: {
          token: appToken,
        },
      },
      order: {
        _id: "ASC",
      },
      skip: offset,
      take: limit,
    });
    // console.log("Notifications ====>", notifications);

    return { notifications, count };
  }

  async getNotificationsWithFilters(
    filterDto: GetNotificationsFilterDto,
    offset?: number,
    limit?: number
  ): Promise<object> {
    const { notification_type, status, search } = filterDto;

    //Don't search entire NotificationsRepo of GNS. Just search for the concerned application
    const query = this.notificationsRepo
      .createQueryBuilder("notifications")
      .orderBy("notifications._id", "ASC")
      .limit(limit)
      .offset(offset);
    // console.log(notification_type, search, status, 'QueryBuilder',);

    if (notification_type) {
      query.andWhere("notifications.notification_type = :notification_type", {
        notification_type,
      });
      // console.log('First Filter', notification_type);
    }

    if (status) {
      query.andWhere("LOWER(notifications.status) LIKE LOWER(:status)", {
        status,
      });
    }

    if (search) {
      query.andWhere("LOWER(notifications.body) LIKE LOWER(:search)", {
        search,
      });
    }

    const [notifications2, count] = await query.getManyAndCount();
    // console.log('Count', count);

    return { notifications2, count };
  }

  async getSpecificNotification(notificationId: string): Promise<Notification> {
    const findThisNotification = await this.notificationsRepo.findOne({
      where: {
        _id: notificationId,
      },
    });

    if (!findThisNotification) {
      throw new NotFoundException("Sorry This Notification Does Not Exist");
    }
    this.logger.log(
      `Notification with ID:  ${notificationId} found. Notification: ${findThisNotification}`
    );
    return findThisNotification;
  }

  async deleteNotification(notificationId: string): Promise<object> {
    const deleteThisNotification = await this.notificationsRepo.delete(
      notificationId
    );
    if (deleteThisNotification.affected === 0) {
      throw new NotFoundException("Notification Not Found!");
    }
    this.logger.log(`Notification with ID: ${notificationId} deleted!`);
    return { message: "Notification Deleted!" };
  }

  // 1- Get notification from db time
  // 2- Compare time & check status.
  //     -- if 'success' don't add to queue else add to queue
  // @Cron(CronExpression.EVERY_MINUTE)
  async sendAutomaticEmail() {
    const date = new Date();

    const messages = await this.notificationsRepo.find({
      where: {
        timeData: LessThanOrEqual(moment(date).format("MMM Do YY")),
        status: "PENDING",
        notification_type: "AUTOMATIC",
      },
      relations: {
        author: true,
      },
    });

    if (messages) {
      messages.map((m) => {
        const messageTosend = {
          text: m.body,
          to: m.recipient,
          subject: m.subject,
          from: m.sent_by,
          token: m.author.token,
          id: m._id,
        };
        console.log("Author token ==>", m._id);

        this.logger.log(`LOG 2 EmailRecipient:  ${messageTosend.to}`);

        return this.automaticNotificationsQueue.add(NOTIFICATIONS_PROCESS, {
          text: m.body,
          to: m.recipient,
          subject: m.subject,
          from: m.sent_by,
          token: m.token,
          id: m._id,
          Token: m.author.token,
        });
      });
    }

    return { message: "No New Messages to add to the Queue" };
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async sendAutomaticSms() {
    const date = new Date();
    const sms = await this.notificationsRepo.find({
      where: {
        timeData: LessThanOrEqual(moment(date).format("MMM Do YY")),
        status: "PENDING",
        notification_type: "AUTOMATIC",
      },
      relations: {
        author: true,
      },
    });
    //testlabhub67#$
    if (sms) {
      sms.map((msg) => {
        return this.automaticNotificationsQueue.add(NOTIFICATIONS_PROCESS_SMS, {
          message: msg.body,
          mobiles: msg.recipient,
          time: msg.timeData,
          id: msg._id,
          token: msg.author.token,
        });
      });
    }
  }

  async saveMessageToSendInCron(email: CronEmailMessage, appToken: string) {
    const getApp = await this.appService.getAppByToken(appToken);

    try {
      this.logger.log(
        `Saving Email Message to send in cron, EmaailRecipient:  ${JSON.stringify(
          email.to
        )}  appId: ${appToken}`
      );
      const saveMessage = this.notificationsRepo.create({
        subject: email.subject,
        recipient: email.to,
        body: email.text,
        status: "PENDING",
        request_data: JSON.stringify(email),
        sent_by: email.from,
        timeData: moment(email.time).format("MMM Do YY"),
        author: getApp,
        notification_type: "AUTOMATIC",
      });

      return this.notificationsRepo.save(saveMessage);
    } catch (error) {
      this.logger.error(
        `An error occured while trying to save message`,
        error.stack
      );
      throw error;
    }
  }

  async saveSmsToSendInCron(sms: smsDto, appToken: string) {
    const getApp = await this.appService.getAppByToken(appToken);
    if (getApp) {
      const saveMessage = this.notificationsRepo.create({
        notification_type: "AUTOMATIC",
        body: sms.message,
        provider: "Nexah",
        recipient: sms.mobiles,
        author: getApp,
        request_data: JSON.stringify(sms),
        // response_data: extractInfo(smsResult, "errordescription"),
        // external_id: extractInfo(smsResult, "messageid"),
        sent_by: getApp.appName,
        timeData: sms.time,
        status: "PENDING",
      });

      return this.notificationsRepo.save(saveMessage);
    }

    throw new NotFoundException("Application Not Found!");
  }

  async searchCronMessages() {
    const messages = await this.notificationsRepo.find({
      where: { notification_type: "AUTOMATIC" },
    });

    if (!messages) {
      this.logger.log(`No Messages with status: PENDING`);
    }
    this.logger.log(
      `RETRIEVED MSG FROM DB! ${messages.map((msg) => {
        return msg.recipient;
      })}`
    );
    return messages;
  }

  async changeCronStatus(id: string) {
    const getMeessage = await this.notificationsRepo.findOne({
      where: {
        notification_type: "AUTOMATIC",
        _id: id,
        status: "PENDING",
      },
    });

    // console.log(getMeessage.status, "<<<====THIS ");

    if (!getMeessage) {
      this.logger.log(`Cannot Find Message`);
      throw new NotFoundException("Message Not Found!");
    }
    // getMeessage.status = "SUCCESS";

    this.logger,
      log(
        `Message with token ${getMeessage.token} status successfully changed!`
      );
    return await this.notificationsRepo.save({
      ...getMeessage,
      status: "SUCCESS",
    });
  }
}

/* 
  1st Attempt;

   async getAllNotification(appToken: string, filterDto: NotificatiionsFilterDto) {
    const {status, type, searchTerm} = filterDto;
    
    const getAppConcerned = await this.notificationsRepo.find({
      where: {
        author: { token: appToken },
      },
      relations: { author: true },
    });

    //Cannot see the link between current app && results
    if (getAppConcerned) {
    const query = this.notificationsRepo.createQueryBuilder("notification");

      if (status) {
        query.andWhere("notification.status = :status", { status });
      }
      if (type) {
        query.andWhere("notification.notification_type = :type", { type });
      }
      if (searchTerm) {
        query.andWhere(
          "LOWER(notification.title) LIKE LOWER(:searchTerm) OR LOWER(notification.subject) LIKE LOWER(:searchTerm)",
          { searchTerm }
        );
      };

      const filteredResults = await query.getManyAndCount();
      return filteredResults;
    }


  }


*/
