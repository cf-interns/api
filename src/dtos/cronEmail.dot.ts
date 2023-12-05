import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CronEmailMessage {
    @IsNotEmpty()
    // @IsEmail()
    to: string;


    @IsNotEmpty()
    @IsString()
    text: string;


    @IsEmail()
    @IsNotEmpty()
    from: string;


    @IsNotEmpty()
    @IsString()
    subject: string;

    // @IsNotEmpty()
    @IsDateString()
    time: string;

    



}