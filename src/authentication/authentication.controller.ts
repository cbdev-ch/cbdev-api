import { Controller, Post, Get, Param, Query, Redirect, Res, ForbiddenException, UseGuards, Req, ImATeapotException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Response, Request } from 'express';
import { OauthGuard } from './oauth.guard';

@Controller('auth')
export class AuthenticationController {
    constructor(private authenticationService: AuthenticationService) {
    }

    @UseGuards(OauthGuard)
    @Get('login')
    async authorize() {
    }

    @UseGuards(OauthGuard)
    @Get('callback')
    async callback(@Req() req) {
        return this.authenticationService.login(req['user']);
    }
}
