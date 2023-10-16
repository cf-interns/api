import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ApplicationDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    appName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}