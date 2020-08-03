import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import PDF2Pic from 'pdf2pic';

@Controller('converter')
export class ConverterController {

    constructor(private converterService: ConverterService) {

    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    toImage(@UploadedFile('file') file) {
        if (!file) throw new BadRequestException('File missing');
        return this.converterService.toImage(file);
    }

    @Get('test')
    async test() {
        await new PDF2Pic({
            density: 150,
            savedir: 'uploads',
            savename: '8db9124b41756446ea3f7c124a20a6e3',
            format: "png",
            size: '1240x1754'
        }).convert('uploads/8db9124b41756446ea3f7c124a20a6e3.pdf');

        return 'test';
    }
}
