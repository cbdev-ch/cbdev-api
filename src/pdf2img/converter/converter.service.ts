import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as pdf from 'pdf-poppler';
import {STATUS_CODES} from 'http';
import * as path from 'path';
import {response} from 'express';

@Injectable()
export class ConverterService {

    convert(file){

        if(file !== undefined && file.mimetype === 'application/pdf'){

            let options = {
                format: 'png',
                out_dir: path.dirname(file.path),
                out_prefix: path.basename(file.path, path.extname(file.path)),
                page: null
            };

            pdf.convert(file.path, options).then( res => {

            }).catch(error => {
                console.log(error);
            });

        } else {
            throw new HttpException('no PDF file sent', HttpStatus.BAD_REQUEST);
        }

        return `http://localhost:3000/${file.filename}-1.png`;

    }

}
