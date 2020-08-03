import { Controller, Get, Res, Query, InternalServerErrorException, Post, ForbiddenException, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiTags, ApiOkResponse, ApiProperty, ApiExcludeEndpoint, ApiParam } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Get('authorize')
    authorize(@Res() response: Response, @Query('integrity') integrity: string, @Query('callback_uri') callbackUri: string) {
        response.redirect(this.authService.getLoginUri(integrity, callbackUri));
    }

    @ApiExcludeEndpoint()
    @Get('callback')
    async callback(@Res() response: Response, @Query('state') integrity: string, @Query('code') code?: string, @Query('error') error?: string, errorDescription?: string) {
        let attemptId = await this.authService.validateIntegrity(integrity);

        if (!error) {
            return response.redirect(await this.authService.getSuccessUri(attemptId, code));
        }


        if (error === 'access_denied') {
            return response.redirect(await this.authService.getFailureUri(attemptId, error, errorDescription));
        }

        console.log(error);
        throw new InternalServerErrorException(); 
    }

    @Post('token')
    async token(@Body('code') code: string) {
        return {
            'access_token': await this.authService.login(code)
        };
    }
}
