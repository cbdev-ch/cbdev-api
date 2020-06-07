import { Module } from '@nestjs/common';
import {ConverterController} from './converter/converter.controller';
import {ConverterService} from './converter/converter.service';
import {MulterModule} from '@nestjs/platform-express';

@Module({
    imports: [MulterModule.register({
        dest: './uploads'
    })],
    controllers: [ConverterController],
    providers: [ConverterService]
})
export class Pdf2imgModule {}
