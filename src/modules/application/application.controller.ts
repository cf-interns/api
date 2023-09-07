import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { ApplicationDto } from 'src/dtos/createApplication.dto';
import { UpdateAppStatus } from 'src/dtos/updateAppStatus.dto';

@Controller('application')
export class ApplicationController {

    constructor(
        private readonly appService: ApplicationService
    ) {}

    @Get()
    async getAllApps(): Promise<Application[]> {
        return this.appService.getAllApps();
    }

    @Get(':id')
    async getAppById(@Param('id') id: number): Promise<Application> {
          return this.appService.getAppById(id);
    }

    @Post('create-app')
    async createApplication(@Body() appDetails: ApplicationDto): Promise<Application> {
        return this.appService.createApplication(appDetails);
    }

    @Patch(':id/status')
    updataAppStatus(
        @Param('id') id: number,
        @Body() updateAppStatusDto: UpdateAppStatus,
    ): Promise<Application> {
        const {status} = updateAppStatusDto;
        return this.appService.updateAppStatus(id, status);
    }

    @Delete(':id')
    deleteApp(@Param('id') id: number): Promise<void> {
        return this.appService.deleteApplication(id);
    }
}
