import { Injectable, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';
import { map } from 'rxjs/operators';

@Injectable()
export class DiscountsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>, private httpService: HttpService) {
    }

    async getAll(category: string): Promise<Product[]> {
        return this.productModel.find({category, active: true}).exec();
    }

    async getCategories(): Promise<string[]> {
        return this.productModel.distinct("category");
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async updateInfo(){
        this.productModel.find({active: true}, (error, products) => {
            if (error) {
                console.log(error);
            } else {
                products.forEach((product) => {
                    this.httpService.get(product.url).subscribe((response) => {
                        if (response.status === 200) {
                            product.isDiscount = response.data.includes(product.discountSearchString);
                        
                            if (product.notAvailableSearchString) {
                                product.isAvailable = !response.data.includes(product.notAvailableSearchString);
                            }

                            product.save();
                        }
                    });
                });
            }
        });
    }
}
