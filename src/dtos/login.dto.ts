import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({example: 'johndoe1@mail.com'})
    @IsEmail()
    email: string;


    @ApiProperty({example: 's6p$ecu2*'})
    @IsNotEmpty()
    @MinLength(9)
    password: string
}