import { Controller, Get, Res, Query, InternalServerErrorException, Post, ForbiddenException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Get('authorize')
    authorize(@Res() response: Response, @Query('integrity') integrity: string, @Query('callback_uri') callbackUri: string) {
        response.redirect(this.authService.getLoginUri(integrity, callbackUri));
    }

    @Get('callback')
    async callback(@Res() response: Response, @Query('state') integrity: string, @Query('code') code?: string, @Query('error') error?: string, errorDescription?: string) {
        this.authService.validateIntegrity(integrity).pipe(
            map((valid) => {
                if (!valid) {
                    throw new ForbiddenException();
                }

                if (!error) {
                    return response.redirect(this.authService.getSuccessUri(integrity, code));
                }


                if (error === 'access_denied') {
                    return response.redirect(this.authService.getFailureUri(integrity, error, errorDescription));
                }

                console.log(error);
                throw new InternalServerErrorException();
            })
        );
    }

    @Post('token')
    token(@Body('code') code: string) {
        return this.authService.login(code).pipe(
            map((result) => {
                return { 'access_token': result };
            })
        );
    }
}
