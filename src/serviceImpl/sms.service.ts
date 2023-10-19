import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Application } from "src/domains/application.entity";
import { Sms } from "src/domains/sms.entity";
import { smsDto } from "src/dtos/sms.dto";
import { Repository } from "typeorm";


@Injectable()
export class SmsService {
    constructor (
        @InjectRepository(Sms)
        private readonly smsRepo: Repository<Sms>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>
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
        const app = await this.appRepo.findOne({where: {token: appId}});

        if (!app) {
            throw new NotFoundException('Application Not Found!')
        };

        try {
            const gnsAuth = {
                user: this.configService.get<string>('NEXAH_SMS_API_USER'),
                password: this.configService.get<string>('NEXAH_SMS_API_PASSWORD'),
                senderid: this.configService.get<string>('NEXAH_SMS_API_SENDERID'),
                sms: sms.message,
                mobiles: sms.mobiles,
                // scheduletime: '2023-08-04 18:19:00'
            };

            const headerReq = {
                'Content-Type': 'application/json; charset=UTF-8',
            };

            const res = await firstValueFrom(this.httpService.get('https://smsvas.com/bulk/public/index.php/api/v1/sendsms?user=user&password=password&senderid=sender&sms=message&mobiles=XXXXXXXXX,XXXXXXXXX,XXXXXXXXX&scheduletime=yyyy-MM-dd%25hh:mm:ss', {
                params: gnsAuth,
                headers: headerReq
            }))

            let smsRes = res.data.sms

            function extractInfo(arr, prop) {
                let extratedValue = arr.map(i => i[prop]);

                let genVal = extratedValue[0]; //TODO: format data to extract entire array

                return genVal;
            }

            const sentSms = this.smsRepo.create({
                status: extractInfo(smsRes, 'status'),
                smsclientid: extractInfo(smsRes, 'status'),
                messageid: extractInfo(smsRes, 'status'),
                errorcode: extractInfo(smsRes, 'status'),
                errordescription: extractInfo(smsRes, 'status'),
                message: sms.message,
                provider: 'Nexah',
                sent_to: extractInfo(smsRes, 'status'),
                totalSmsUnit: extractInfo(smsRes, 'status'),
                balance: extractInfo(smsRes, 'status'),
                author: app
            });
            console.log(sentSms, 'SMS+++');
            

            if (sentSms.status === 'success' && sentSms.errorcode === 'success' && sentSms.errordescription === 'success') {
                
                 await this.smsRepo.save(sentSms); 
                return {message: 'SMS successfully sent!'}


            }  else {

                throw new HttpException('Something went wrong', HttpStatus.NOT_IMPLEMENTED)
            }


        } catch (error) {
            
            console.log(error.message);
            
        }
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