import { Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './password.entity';
import { EmailModule } from '../email/email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Password]), EmailModule, UserModule],
  controllers: [PasswordController],
  providers: [PasswordService]
})
export class PasswordModule { }
