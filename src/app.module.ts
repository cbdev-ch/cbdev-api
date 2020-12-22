import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import { DiscountsModule } from './discounts/discounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StatusController } from './status/status.controller';
import { ConverterModule } from './converter/converter.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {doc} from "prettier";
import { join } from 'path';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }), Pdf2imgModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads')
  }), ReminderModule, UserModule, AuthModule, ConverterModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
  }),
  MongooseModule.forRoot(`mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST1}:${process.env.MONGODB_PORT1},${process.env.MONGODB_HOST2}:${process.env.MONGODB_PORT2},${process.env.MONGODB_HOST3}:${process.env.MONGODB_PORT3}/${process.env.MONGODB_DATABASE}?replicaSet=${process.env.MONGODB_REPLICA_SET}?authSource=${process.env.MONGODB_AUTH_SOURCE}`, { useNewUrlParser: true, useUnifiedTopology: true})
  ],
  controllers: [StatusController],
})
export class AppModule {
}
