import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDataDto {

    @ApiProperty({example: 'John'})
    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    firstName: string;

    @ApiProperty({example: 'Doe'})
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    lastName: string;

    @ApiProperty({example: 'johndoe2@mail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 's6p$ecu2*'})
    @IsNotEmpty()
    @MinLength(9)
    password: string
}