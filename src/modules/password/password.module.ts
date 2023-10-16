import { Module } from '@nestjs/common';
import { PasswordController } from '../../controllers/password.controller';
import { PasswordService } from '../../serviceImpl/password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from '../../domains/password.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Password]), EmailModule, UserModule],
  controllers: [PasswordController],
  providers: [PasswordService]
})
export class PasswordModule { }
