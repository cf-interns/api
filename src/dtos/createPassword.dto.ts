import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class ForgotPasswordDto {
    @ApiProperty({example: 'johndoe1@mail.com'})
    @IsEmail()
    to: string;
}