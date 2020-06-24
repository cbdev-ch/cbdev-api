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
    callback(@Res() response: Response, @Query('state') integrity: string, @Query('code') code?: string, @Query('error') error?: string, errorDescription?: string) {
        if (this.authService.validateIntegrity(integrity)) {
            if (error) {
                if (error === 'access_denied') {
                    return response.redirect(this.authService.getFailureUri(integrity, error, errorDescription));
                }
                console.log(error);
                throw new InternalServerErrorException();
            } else {
                return response.redirect(this.authService.getSuccessUri(integrity, code));
            }
        }
        throw new ForbiddenException();
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
