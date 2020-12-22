import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import {Converter} from './Converter';
import {switchMap} from 'rxjs/operators';
import {PDFImage} from 'pdf-image';
import {join} from "path";

@Injectable()
export class ConverterService {

    async toImage(file) {

        switch (file['mimetype']) {
            case 'application/pdf':

                let filePath = join(__dirname, '..', '..', file.path);

                let pdfImage = new PDFImage(filePath)
                await pdfImage.convertPage(0);

                console.log(pdfImage);





                //let converter = new Converter(file);

                //return converter.getFileResolution().pipe(switchMap(specs =>
                //    converter.getImage(specs, converter.filePath)
                //));

                return 'doris';

            default:
                throw new UnsupportedMediaTypeException();
        }
    }
}
