import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    ConfigService,
    UserService
  ],
  controllers: [UserController]
})
export class UserModule {}
