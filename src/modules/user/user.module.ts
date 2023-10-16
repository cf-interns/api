import { Module } from '@nestjs/common';
import { UserController } from '../../controllers/user.controller';
import { UserService } from 'src/serviceImpl/user.service';
import { User } from '../../domains/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Password } from 'src/domains/password.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Password]), EmailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
