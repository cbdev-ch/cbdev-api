import {from, Observable} from 'rxjs';
//import PDFParser from 'pdf2json';
//import PDF2Pic from 'pdf2pic';
import {join} from 'path';
import {File} from './models/file.model';

export type PDFSpecs = {Pages:{Height:number}[],Width: number}

export class Converter {

    /*

    constructor(private file: File) {  }

    getFileResolution():Observable<PDFSpecs>{
        return new Observable(subscriber => {
            let pdfParser = new PDFParser();
            pdfParser.loadPDF(this.filePath);

            pdfParser.on('pdfParser_dataReady', pdfData => {
                let result = pdfData.formImage as PDFSpecs;
                subscriber.next(result);
                subscriber.complete();
            });
        })
    }

    getImage(specs: PDFSpecs, filePath:string): Observable<{name: string}>{

        const width = specs.Width * 24;
        const height = specs.Pages[0].Height * 24;

        let pdf2pic = new PDF2Pic({
            density: 600,
            savedir: join(__dirname, '..', '..', 'uploads'),
            savename: this.file.filename,
            format: 'png',
            size: height + 'x' + width
        })

        return from(pdf2pic.convert(filePath));
    }


    get filePath(){
        return join(__dirname, '..', '..', this.file.path);
    }
     */
}