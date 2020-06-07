import {HttpService, Injectable} from '@nestjs/common';
import * as mongoose from 'mongoose';

import Product from '../models/products';
import {Cron, CronExpression} from '@nestjs/schedule';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class RedbullDiscountService {

    constructor(private httpService: HttpService, private configService: ConfigService) {
    }

    test(){

        mongoose.connect(this.configService.get<string>('url'), { useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
        }).catch((error) => {
            console.log('error1: ' + error);
        });

        let test = new Product({
            storeName: 'Coop',
            productName: 'Red Bull',
            productType: '24x250ml',
            discountSearchString: 'class=\\"flag__inner\\"',
            notAvailableSearchString: 'Nicht verfügbar',
            isDiscount: false,
            isAvailable: true,
            url: 'https://www.coopathome.ch/de/supermarkt/getr%c3%a4nke/soft-drinks/sport-energydrinks/energydrinks/red-bull-energy-drink-24x25cl/p/4390087'
        });

        test.save( (err) => {
            if(err){
                console.log('error2: ' + err);
            }
        });

        mongoose.disconnect();

        return 'doris';
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    updateInfo(){

        mongoose.connect(this.configService.get<string>('url'), { useNewUrlParser: true, useUnifiedTopology: true}).then(
            () => {
                Product.find({}, (err, products) => {

                    if(err){
                        console.log(err);
                    } else {
                        products.forEach( (product) => {
                            console.log(product.storeName);
                        })
                    }

                });
            }
        );


        //mongoose.connection.close();

        //this.httpService.get('https://produkte.migros.ch/red-bull-energy-drink-120209600000').toPromise().then((response) =>{

        //    if(response.data.includes('sidebar-discount-badge')){
        //        console.log('true')
        //    }
        //})

    }

}
