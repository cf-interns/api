import { Module } from '@nestjs/common';
import { EmailController } from '../../controllers/email.controller';
import { EmailService } from '../../serviceImpl/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../../domains/email.entity';
import { ApplicationModule } from '../application/application.module';
import { Application } from 'src/domains/application.entity';

@Module({
  imports: [MailerModule.forRoot({
    transport: {
      service: 'gmail',
      host: 'localhost',
      secure: true,
      logger: true,
      debug: true,
      // secureConnection: false,
      auth: {
        user: 'xendriixxtestmail@gmail.com',
        pass: 'nzvd msye jxzw yvaq '
      },
      tls: { rejectUnauthorized: true }
    },
    defaults: {
      from: 'no-reply@payunit.net'
    }
  }), TypeOrmModule.forFeature([Email, Application]), ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
