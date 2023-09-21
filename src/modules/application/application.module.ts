import { Module } from '@nestjs/common';
import { ApplicationController } from '../../controllers/application.controller';
import { ApplicationService } from '../../serviceImpl/application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../../domains/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationController],
  providers: [ApplicationService]
})
export class ApplicationModule { }
