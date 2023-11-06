import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class smsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber("CM")
  mobiles: string;

  @IsDateString()
  time?: string;

  _id?: string;

  token?: string;
}