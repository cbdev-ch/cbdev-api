import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { DiscountsModule } from './discounts/discounts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }), MongooseModule.forRoot(`mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST1}:${process.env.MONGODB_PORT1},${process.env.MONGODB_HOST2}:${process.env.MONGODB_PORT2},${process.env.MONGODB_HOST3}:${process.env.MONGODB_PORT3}/${process.env.MONGODB_DATABASE}?replicaSet=${process.env.MONGODB_REPLICA_SET}?authSource=${process.env.MONGODB_AUTH_SOURCE}`, { useNewUrlParser: true, useUnifiedTopology: true}), 
   DiscountsModule],
  providers: [],
})
export class AppModule {
}
