import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { QueueConfig } from "src/config/queue.config";
import { CallbackService } from "src/serviceImpl/callback.service";

@Injectable()
export class RabbitSubscriberService {
  private logger = new Logger(RabbitSubscriberService.name);
  private queueConfig;

  constructor(private readonly callbackService: CallbackService) {}

  @RabbitSubscribe(QueueConfig.create_callback)
  async createCallbackFromCore(data: any): Promise<any> {
    try {
      this.callbackService.createCallback(data);
    } catch (e) {
      this.logger.error(e);
      return new Nack();
    }
  }
}
