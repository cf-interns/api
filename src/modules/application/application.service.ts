import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { ApplicationDto } from 'src/dtos/createApplication.dto';
import { AppStatus } from './app-status.enum';
import { User } from '../user/user.entity';
import { id } from 'date-fns/locale';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>
    ) {}


    async getAllApps(): Promise<Application[]> {

        const allApps = await this.appRepo.find({relations: ['author']});
        return allApps;
    }

    async getAppById(_id: number): Promise<Application> {
        const findThisApp = await this.appRepo.findOne({
            where: {
                _id: _id,
            },
            relations: ['author']
        });

        if (!findThisApp) {
            throw new NotFoundException('App Does Not Exist');
        };

        return findThisApp;
    }

    async createApplication(appDetails: ApplicationDto, owner: User): Promise<Application> {
        const {appName, description} = appDetails
        const app = this.appRepo.create({
            appName,
            description,
            status: AppStatus.INACTIVE,
            author: owner
        });

        await this.appRepo.save(app);


        if (!app) {
            throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST);
        }

        return app

    }

    async updateAppStatus(_id: number, status: AppStatus): Promise<Application> {
        const app = await this.appRepo.findOne({
            where: {_id: _id},
            relations: ['']
        });
        app.status = status;
        await this.appRepo.save(app);
        return app;

    }

    async deleteApplication(id: number): Promise<void> {
        const deleteThisApp = await this.appRepo.delete(id);

        if (deleteThisApp.affected === 0) {
            throw new NotFoundException('Application Not Found!');
        }
    }
}
