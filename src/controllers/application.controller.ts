import { Controller, Post, Body, Req, Patch, Param, Delete, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApplicationService } from '../serviceImpl/application.service';
import { Application } from '../domains/application.entity';
import { ApplicationDto } from 'src/dtos/createApplication.dto';
import { UpdateAppStatus } from 'src/dtos/updateAppStatus.dto';
import RequestObjectWithUser from '../services/requestWithUser.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('applications')
@Controller('applications')
export class ApplicationController {

    constructor(
        private readonly appService: ApplicationService
    ) { }


    @ApiOperation({ summary: 'Get all created applications', description: 'List of all the apps created by a specific user(creator). This route is protected only authenticated users can access it' })
    @ApiResponse({
        type: ApplicationDto,
        status: 200,
        description: 'Successfully sent App List'
    })
    @HttpCode(200)
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllApps(@Req() req: RequestObjectWithUser): Promise<Application[]> {
        console.log(req.user?._id, 'User Apps');

        return this.appService.getAllApps(req.user._id);
    }


    @ApiOperation({ summary: 'Get specific app' })
    @Get(':id')
    async getAppById(@Param('id') id: string): Promise<Application> {
        return this.appService.getAppById(id);
    }


    @ApiOperation({ summary: 'Register a new App', description: 'This route is protected, only authenticated users can create an application' })
    @ApiResponse({
        type: ApplicationDto,
        status: 201,
        description: 'Application successfully created!'
    })
    @Post('create-app')
    @UseGuards(JwtAuthGuard)
    async createApplication(@Body() appDetails: ApplicationDto, @Req() req: RequestObjectWithUser): Promise<Application> {
        return this.appService.createApplication(appDetails, req.user);
    }


    @ApiOperation({ summary: 'Update an app status', description: 'Updata an app status. This route is also protected, so a user must be authenticated to make changes to an application' })

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updataAppStatus(
        @Param('id') id: string,
        @Body() updateAppStatusDto: UpdateAppStatus,
    ): Promise<Application> {
        
        const { status } = updateAppStatusDto;
        console.log(id, 'IDDD', status, 'STATUS');

        return this.appService.updateAppStatus(id, status);
    }

    @ApiOperation({ summary: 'Delete an application', description: 'An authenticated user can delete an application by making a request to this endpoint.' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteApp(@Param('id') id: number): Promise<void> {
        return this.appService.deleteApplication(id);
    }
}
