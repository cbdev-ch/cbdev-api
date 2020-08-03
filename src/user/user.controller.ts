import { Controller, Get, UseGuards, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiOkResponse, ApiSecurity, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from './user.model';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {
        
    }

    @ApiOkResponse({ type: User })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Get('@me')
    me(@Req() req) {
        return this.userService.getByDiscordId(req['user'].id);
    }
}
