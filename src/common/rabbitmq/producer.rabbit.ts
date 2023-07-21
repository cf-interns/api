import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProducerService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService
  ) {}

  private readonly logger = new Logger(ProducerService.name);

  async processAsyncExecution(data: any, routingKey: string): Promise<any> {
    try {
      this.amqpConnection.publish(
        this.configService.get<string>("rabbit.exchange"),
        routingKey,
        data
      );
    } catch (error: any) {
      this.logger.log(error);
    }
  }
}
