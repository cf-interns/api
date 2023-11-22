import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { string } from "joi";


export class UpdateUserInfoDto {
  @ApiProperty({ example: "John" })
  @IsNotEmpty()
  @IsAlpha()
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  lastName: string;

  @ApiProperty({ example: "johndoe2@mail.com" })
  @IsEmail()
  email: string;
}