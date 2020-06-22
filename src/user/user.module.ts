import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    ConfigService,
    UserService
  ]
})
export class UserModule {}
