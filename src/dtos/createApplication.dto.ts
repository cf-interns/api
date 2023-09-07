import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ApplicationDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    appName: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}