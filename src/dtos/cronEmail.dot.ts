import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CronEmailMessage {
  @ApiProperty()
  @IsNotEmpty()
  // @IsEmail()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()

  // @IsNotEmpty()
  @IsDateString()
  time: string;
}