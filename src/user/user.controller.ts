import { Controller, Get, UseGuards, Req, Request } from '@nestjs/common';
import { JwtGuard } from 'src/authentication/jwt.guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Get('@me')
    me(@Req() req) {
        return req['user'];
    }
}
