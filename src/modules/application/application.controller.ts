import { Controller, Post, Body,Req, Patch, Param, Delete, Get, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { ApplicationDto } from 'src/dtos/createApplication.dto';
import { UpdateAppStatus } from 'src/dtos/updateAppStatus.dto';
import RequestObjectWithUser from '../auth/requestWithUser.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';

@Controller('applications')
export class ApplicationController {

    constructor(
        private readonly appService: ApplicationService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllApps(@Req() req: RequestObjectWithUser): Promise<Application[]> {
        return this.appService.getAllApps();
    }

    @Get(':id')
    async getAppById(@Param('id') id: number): Promise<Application> {
          return this.appService.getAppById(id);
    }
    
    
    @Post('create-app')
    @UseGuards(JwtAuthGuard)
    async createApplication(@Body() appDetails: ApplicationDto, @Req() req: RequestObjectWithUser): Promise<Application> {
        return this.appService.createApplication(appDetails, req.user);
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
