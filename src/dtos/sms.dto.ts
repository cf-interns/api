import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class smsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber("CM")
  mobiles: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  time?: string;

  @ApiProperty()
  _id?: string;

  @ApiProperty()
  token?: string;
}