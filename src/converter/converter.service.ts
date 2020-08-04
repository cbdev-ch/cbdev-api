import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';

import path, {join} from 'path';
import {Converter} from "./Converter";
import {switchMap} from "rxjs/operators";

@Injectable()
export class ConverterService {

    async toImage(file) {

        switch (file['mimetype']) {
            case 'application/pdf':

                let converter = new Converter(file);

                return converter.getFileResolution().pipe(switchMap(specs =>
                    converter.getImage(specs, converter.filePath)
                ));

            default:
                throw new UnsupportedMediaTypeException();
        }
    }
}
