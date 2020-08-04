import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get } from '@nestjs/common';
import {FileInterceptor, FilesInterceptor, MulterModule} from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import {diskStorage} from 'multer';

@Controller('converter')
export class ConverterController {

    constructor(private converterService: ConverterService) {

    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads')
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf')
            }
        })
    }))
    toImage(@UploadedFile('file') file) {
        if (!file) throw new BadRequestException('File missing');
        return this.converterService.toImage(file);
    }

}
