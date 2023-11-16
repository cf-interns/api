import { IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationStatus, NotificationType } from "src/enums/notificationStatus.enum";


export class NotificatiionsFilterDto {

    @IsOptional()
    @IsEnum(NotificationStatus)
    status?: NotificationStatus

    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType

    @IsOptional()
    @IsString()
    searchTerm?: string
}