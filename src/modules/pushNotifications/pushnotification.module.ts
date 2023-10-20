import { FcmModule } from "@doracoder/fcm-nestjs";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import PushNotificationsController from "src/controllers/pushNotification.controller";
import { Application } from "src/domains/application.entity";
import { Push } from "src/domains/pushNotification.entity";
import { User } from "src/domains/user.entity";
import PushNotificationsService from "src/serviceImpl/pushNotification.service";
// import {app} from './firebaseConfig';

@Module({
    imports: [/* FcmModule.forRoot({
        firebaseSpecsPath: 'src/modules/pushNotifications/gns-cf-firebase-adminsdk-29h4u-d087cc1e89.json'
    }) */ TypeOrmModule.forFeature([Push, Application])],
    controllers: [PushNotificationsController],
    providers: [PushNotificationsService],
    exports: [PushNotificationsService]
})

export default class PushNotificationsModule {}