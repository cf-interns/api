import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { rabbit } from "src/config/queue.config";
import { ProducerService } from "./producer.rabbit";

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: async () => ({
        exchanges: [
          {
            name: rabbit.exchange,
            type: "topic",
          },
        ],
        uri: rabbit.uri,
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class RabbitMqModule {}
