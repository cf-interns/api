import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RabbitMqModule } from "src/common/rabbitmq/rabbitmq.module";
import { CallbackController } from "src/controllers/callback/callback.controller";
import { Callback } from "src/domains/callback.entity";
import { CallbackService } from "src/serviceImpl/callback.service";
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [TypeOrmModule.forFeature([Callback]), RabbitMqModule,],
  controllers: [CallbackController],
  providers: [CallbackService,],
  exports: [],
})
export class CoreModule {}
