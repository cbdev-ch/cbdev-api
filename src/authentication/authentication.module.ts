import { Module, HttpModule } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './authentication.controller';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

dotenv.config();

@Module({
    imports: [
        /*MongooseModule.forFeature([]),*/
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
        }),
        HttpModule,
        UserModule,
    ],
    providers: [
        ConfigService,
        AuthenticationService,
        JwtStrategy,
        UserService
    ],
    controllers: [AuthenticationController]
})
export class AuthenticationModule {
}
