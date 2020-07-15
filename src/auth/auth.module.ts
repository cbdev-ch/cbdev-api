import { Module, HttpModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginAttempt, LoginAttemptSchema } from './login-attempt.schema';
import { UserDocument, UserSchema } from 'src/user/user.schema';

require('dotenv').config();

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: LoginAttempt.name, schema: LoginAttemptSchema, collection: 'loginAttempts' },
      { name: UserDocument.name, schema: UserSchema, collection: 'users' },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    ConfigService,
    JwtAuthStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
