import { IsAlpha, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDataDto {

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(9)
    password: string
}