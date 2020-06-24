import { Controller, Post, Get, Param, Query, Redirect, Res, ForbiddenException, UseGuards, Req, ImATeapotException, Body, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Response, Request } from 'express';
import { map, catchError } from 'rxjs/operators';

@Controller('auth')
export class AuthenticationController {
    constructor(private authService: AuthenticationService) {
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
            }),
            catchError((error, caught) => {
                console.log(error);
                return caught;
            })
        )
    }
}
