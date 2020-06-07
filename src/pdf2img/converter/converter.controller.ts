import {Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ConverterService} from './converter.service';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('pdf2img/converter')
export class ConverterController {

    constructor(private converterService: ConverterService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file){
        return this.converterService.convert(file);
    }

}
