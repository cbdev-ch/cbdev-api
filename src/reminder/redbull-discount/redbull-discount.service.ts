import {HttpService, Injectable} from '@nestjs/common';

import Product from '../models/products';
import {Cron, CronExpression} from '@nestjs/schedule';
import {map} from 'rxjs/operators';
import {response} from 'express';

@Injectable()
export class RedbullDiscountService {

    constructor(private httpService: HttpService) {
    }

    test(){
        let test = new Product()
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    updateInfo(){

        return this.httpService.get<any>('https://produkte.migros.ch/red-bull-energy-drink-120266000000')
            .pipe(
                map(response => response.data)
            );

    }

}
