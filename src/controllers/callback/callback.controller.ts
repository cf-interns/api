import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { toSuccessResponse } from "src/common/helpers";
import { SuccessResponseDto } from "src/dtos/responses/sucess.dto";
import { CallbackService } from "src/serviceImpl/callback.service";

@Controller("callback")
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Post("")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any): Promise<SuccessResponseDto> {
    try {
      const response = await this.callbackService.updateCallback(body);

      return toSuccessResponse(
        response,
        "Callback created",
        "SUCCESS-CALLBACK"
      );
    } catch (e) {
      throw new HttpException(e.message, e.status);
      
    }
  }
}
