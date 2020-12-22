import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from './user.schema';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users'
    }]),
  ],
  providers: [
    ConfigService,
    UserService
  ],
  controllers: [UserController],
  exports: [
    UserService
  ]
})
export class UserModule {}
