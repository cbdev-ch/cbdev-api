import { Module, HttpModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';

@Module({
  imports: [
    HttpModule,
    /*MongooseModule.forFeature([]),*/
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    UserModule
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
