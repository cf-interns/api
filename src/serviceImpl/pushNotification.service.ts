import { FcmService } from "@doracoder/fcm-nestjs";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getMessaging, } from "firebase-admin/messaging";
import getToken from 'firebase/messaging'
import { Application } from "src/domains/application.entity";
import { Push } from "src/domains/pushNotification.entity";
import { User } from "src/domains/user.entity";
import { PushNotificationDto } from "src/dtos/pushNotification.dto";
import { Repository } from "typeorm";



@Injectable()
export default class PushNotificationsService {

  constructor(
    //  readonly fcmService: FcmService
    @InjectRepository(Push)
    private readonly pushRepo: Repository<Push>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) { }



  /*  async sendToDevices(payload: PushNotificationDto,) {
          await this.fcmService.sendNotification(['cSV5z26FJ_og33Hyut1ITh:APA91bERqcy7xqg-USG0V7vHP7taWB9FeHVzTxyL6Dfd5ZJV_HjwVu8xLgAf6k0kEcTUh2aDLNOm5eyCoaQaRSpTkULkV0RjAHHXEHXVLrg1V5PyHQBKkZKu57pKOkyZN6FiuhC_RKgo'], payload, false)
   } */


  async getAllPushNotifications(appId: string): Promise<Push[]>{
    const allPushes = await this.pushRepo.find({
      relations: {author: true},
      where: {author: {_id: appId}}
    });

    if(!allPushes) {

      throw new HttpException('Sorry No Notifications Have been Found!', HttpStatus.NOT_FOUND)

    }

    return allPushes
  }

  async getPushNotificationById(pushId: string): Promise<Push> {
    const findThisPush = await this.pushRepo.findOne({
      where: {
        _id: pushId
      }
    });

    if (!findThisPush) {
      throw new NotFoundException('Notification Does Not Exist');
    };
    return findThisPush;
  }

  async sendMessage(message: PushNotificationDto, applicationId: string) {
    console.log(applicationId, 'ID+++++');
    
    const app = await this.applicationRepository.findOne({ where: { token: applicationId } })
    if (!app) {
      
      throw new HttpException('Application Not Found', HttpStatus.NOT_FOUND)
    }

    // console.log(message);
    getMessaging()
      .send(message)
      .then(async (res) => {
        const savePush = new Push()
        savePush.title = message.notification.title
        savePush.body = message.notification.body
        savePush.icon = message.notification.icon

        savePush.author = app
        await this.pushRepo.save(savePush)

        console.log("Notification Successfuly Sent", res);

        return savePush;

      })
      .catch((error) => {
        console.log(error);

        throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)

      })
    return { message: 'Successfully sent message' }


  }

    async deletePushNotification(pushId: string): Promise<object> {
      const deleteThisPush = await this.pushRepo.delete(pushId)
      if (deleteThisPush.affected === 0) {
        throw new NotFoundException('Notification Not Found')
      }
    return {message: 'Notification Deleted!'}

    }
  

}