import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator"


export class PushNotificationDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  notification: {
    body: string;
    title: string;
    // icon: string | null
  };

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  userToken: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  time?: string;
}