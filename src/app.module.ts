import { Module } from '@nestjs/common';
import { ReminderModule } from './reminder/reminder.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {MongooseModule} from '@nestjs/mongoose';
import { Pdf2imgModule } from './pdf2img/pdf2img.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }), Pdf2imgModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads')
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
