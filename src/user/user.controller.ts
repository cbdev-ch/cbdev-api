import { Controller, Get, UseGuards, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {
        
    }

    @Get('@me')
    me(@Req() req) {
        return req['user'];
    }
}
