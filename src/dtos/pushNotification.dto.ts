import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsObject, IsString } from "class-validator"


export class PushNotificationDto {

    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    notification: {
        body: string,
        title: string,
        // icon: string | null
    }

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string  
}