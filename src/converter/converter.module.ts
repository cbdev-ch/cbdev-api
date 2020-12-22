import { Module } from '@nestjs/common';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      preservePath: true
    })
  ],
  controllers: [ConverterController],
  providers: [ConverterService]
})
export class ConverterModule {
}
