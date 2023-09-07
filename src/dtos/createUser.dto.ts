import { IsAlpha, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    lastName: string;

    @IsNotEmpty()
    @MinLength(9)
    password: string
}