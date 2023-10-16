import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Sms } from "src/domains/sms.entity";
import { smsDto } from "src/dtos/sms.dto";
import { Repository } from "typeorm";


@Injectable()
export class SmsService {
    constructor (
        @InjectRepository(Sms)
        private readonly smsRepo: Repository<Sms>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    async sendSms(sms: smsDto, ) {
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
            });

            if (sentSms.status === 'success' && sentSms.errorcode === null && sentSms.errordescription === null) {
                
                 await this.smsRepo.save(sentSms);

            }  else {

                throw new HttpException('Something went wrong', HttpStatus.NOT_IMPLEMENTED)
            }

            return {message: 'SMS successfully sent!'}

        } catch (error) {
            
            console.log(error.message);
            
        }
    }
}