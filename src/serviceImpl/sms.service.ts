import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "src/domains/application.entity";
import { Sms } from "src/domains/sms.entity";
import { smsDto } from "src/dtos/sms.dto";
import { Repository } from "typeorm";
import { Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { ApplicationService } from "./application.service";


@Injectable()
export class SmsService {
    private logger = new Logger('SmsService');
    constructor (
        @InjectRepository(Sms)
        private readonly smsRepo: Repository<Sms>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>,
        private readonly appService: ApplicationService,
    ) {}

    async getAllSms(appId: string): Promise<Sms[]> {

        const allSms = await this.smsRepo.find({
            relations: {author: true},
            where: {author: {token: appId}}
        });

        if (!allSms) {
            throw new NotFoundException('Sorry No SMS Have been Found!')
        }

        return allSms
    }

    async getSmsById(smsId: string): Promise<Sms> {

        const findThisSms = await this.smsRepo.findOne({
            where: {id: smsId}
        });

        if (!findThisSms) {
            throw new NotFoundException('SMS Does Not Exist');
        };

        return findThisSms;
    }




    async sendSms(sms: smsDto, appId: string): Promise<object> {
        const app = await this.appService.getAppByToken(appId);

        if (app.status !== 'ACTIVE') {
            throw new HttpException('Please Activate Your App!', HttpStatus.UNAUTHORIZED);
        };


            const url = this.configService.get<string>('nexah.url')
            const gnsAuth = {
                user: this.configService.get<string>('nexah.user'),
                password: this.configService.get<string>('nexah.password'),
                senderid: this.configService.get<string>('nexah.senderId'),
                sms: sms.message,
                mobiles: sms.mobiles,
                // scheduletime: '2023-08-04 18:19:00'
            };

            const headerReq = {
                'Content-Type': 'application/json; charset=UTF-8',
            };


            try {

            const res = await firstValueFrom(this.httpService.get(url, {
                params: gnsAuth,
                headers: headerReq
            }).pipe (
                catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);
                    throw 'An error happened'
                })
            ))

            let smsRes = res.data.sms

            

            function extractInfo(arr: any[], prop: string) {
                let extratedValue = arr.map((i) => i[prop])

                let genVal = extratedValue[0]; //TODO: format data to extract entire array

                return genVal;
            }

            const sentSms = this.smsRepo.create({
                status: extractInfo(smsRes, 'status'),
                smsclientid: extractInfo(smsRes, 'smsclientid'),
                messageid: extractInfo(smsRes, 'messageid'),
                errorcode: extractInfo(smsRes, 'errorcode'),
                errordescription: extractInfo(smsRes, 'errordescription'),
                message: sms.message,
                provider: 'Nexah',
                sent_to: sms.mobiles,
                totalSmsUnit: extractInfo(smsRes, 'total_sms_unit'),
                balance: extractInfo(smsRes, 'balance'),
                author: app
            });
            console.log(sentSms, 'SMS+++');
            

            if (sentSms.status === 'success' && sentSms.errorcode === null && sentSms.errordescription === null) {
                
                 await this.smsRepo.save(sentSms); 
                return {message: 'SMS successfully sent!'}


            }  else {
                const message = sentSms.errordescription;
                return {message}

                // throw new HttpException('Something went wrong', HttpStatus.NOT_IMPLEMENTED)
            }
                
            } catch (error) {
                this.logger.error(`Error`, error.stack)
            }

            return {message: 'SMS Successfully Snet!'}



       
    }




    async deleteSms(smsId: string): Promise <object> {
        const deleteThisSms = await this.smsRepo.delete(smsId);
        if (deleteThisSms.affected === 0) {
            throw new NotFoundException('Notification Not Found')
        } 

        return {message: 'SMS Deleted!'}
    }
}




/* message: 'Testing GNS App 3',
  status: 'success',
  provider: 'Nexah',
  sent_to: 'success',
  smsclientid: 'success',
  messageid: 'success',
  errorcode: 'success',
  errordescription: 'success',
  totalSmsUnit: 'success',
  balance: 'success', */