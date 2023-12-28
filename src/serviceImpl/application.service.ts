import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../domains/application.entity';
import { Repository } from 'typeorm';
import { ApplicationDto } from 'src/dtos/createApplication.dto';
import { AppStatus } from '../enums/app-status.enum';
import { User } from '../domains/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>
    ) { }


    async getAllApps(_id: string): Promise<Application[]> {

        const allApps = await this.appRepo.find({

            relations: /* ['author'] */ {
                author: true,

            },
            where: {
                author: {
                    _id: _id
                }
            }
            /*   select: {
                  author: _id
              }, */
            /*  where: {
                  author: _id
             }, */

        });
        return allApps;
    }

    async getAppById(_id: string): Promise<Application> {
        const findThisApp = await this.appRepo.findOne({
            where: {
                _id,

            },
            // relations: ['author']
        });

        if (!findThisApp) {
            throw new NotFoundException('App Does Not Exist');
        };

        return findThisApp;
    }

    async getAppByToken(token: string): Promise<Application> {
        const findApp = await this.appRepo.findOne({
            where: {token},
            // relations: ['notification']
        });
        if (!findApp) {
            throw new NotFoundException('App Not Found!');
            
        }

        return findApp
    } 

    async createApplication(appDetails: ApplicationDto, owner: User): Promise<Application> {
        const { appName, description } = appDetails
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

    async updateAppStatus(_id: string, status: AppStatus): Promise<Application> {
        const app = await this.appRepo.findOne({
            where: { _id: _id },
            // relations: ['applications']
        });
        console.log(app, 'App');
        
        app.status = status;
        await this.appRepo.save(app);
        return app;

    }

    async deleteApplication(id: number): Promise<void> {
        const deleteThisApp = await this.appRepo.delete(id);

        if (deleteThisApp.affected === 0) {
            throw new NotFoundException('Application Not Found!');
        }
    };

    async regenerateAppToken(id: string){
        const getApp = await this.appRepo.findOne({
            where: {_id: id}
        });

        const newToken = randomUUID();

        getApp.token = newToken;
        await this.appRepo.save(getApp);

        return getApp;

    }

    
}



/* 

http://192.168.100.155/commonfactor/global-notification/api.git*/