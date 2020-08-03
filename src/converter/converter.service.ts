import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import PDF2Pic from 'pdf2pic';
import path from 'path';
import { config } from 'dotenv/types';

@Injectable()
export class ConverterService {

    async toImage(file) {
        console.log(file);
        console.log(path.dirname(file['path']));
        console.log(path.basename(file['path'], path.extname(file['path'])));
        switch (file['mimetype']) {
            case 'application/pdf':
                await new PDF2Pic({
                    density: 150,
                    savedir: path.dirname(file['path']),
                    //savename: path.basename(file['path'], path.extname(file['path'])),
                    savename: path.basename(file['path']),
                    format: "png",
                    size: '1240x1754'
                }).convert(file['path']);

                return 'test';

            default:
                throw new UnsupportedMediaTypeException();
        }
    }
}
