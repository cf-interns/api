import { IsEnum } from "class-validator";
import { AppStatus } from "src/enums/app-status.enum";


export class UpdateAppStatus {
    @IsEnum(AppStatus)
    status: AppStatus
}