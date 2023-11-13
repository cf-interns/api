import { IsOptional, IsString } from "class-validator";


export class GetNotificationsFilterDto {
  @IsOptional()
  @IsString()
  notification_type?: string;

  
  @IsOptional()
  @IsString()
  search?: string;


  @IsOptional()
  @IsString()
  status?: string;
}