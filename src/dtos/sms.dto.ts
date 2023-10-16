import { IsNotEmpty, IsString } from "class-validator";


export class smsDto {
    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    mobiles: string
}