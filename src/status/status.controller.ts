import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('misc')
@Controller('status')
export class StatusController {
    @Get()
    status() {
        return 'Online';
    }
}
