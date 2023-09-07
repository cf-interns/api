import { IsEnum } from "class-validator";
import { AppStatus } from "src/modules/application/app-status.enum";


export class UpdateAppStatus {
    @IsEnum(AppStatus)
    status: AppStatus
}