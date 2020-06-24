import { Injectable, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

@Injectable()
export class DiscountsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>, private httpService: HttpService) {
        this.updateInfo();
    }

    async getAll(category: string): Promise<Product[]> {
        return this.productModel.find({category, active: true}).exec();
    }

    async getCategories(): Promise<string[]> {
        return this.productModel.distinct("category");
    }

    @Cron(CronExpression.EVERY_HOUR)
    async updateInfo(){
        this.productModel.find({active: true}, (error, products) => {
            if (error) {
                console.log(error);
            } else {
                products.forEach((product) => {
                    this.httpService.get(product.url).pipe(
                        catchError((error, caught) => {
                            let response: AxiosResponse = error.response;

                            if (response.status === 404) {
                                return caught;
                            }

                            console.log(error);
                            return caught;
                        })
                    ).subscribe((response) => {
                        if (response.status === 200) {
                            product.isDiscount = response.data.includes(product.discountSearchString);
                        
                            if (product.notAvailableSearchString) {
                                product.isAvailable = !response.data.includes(product.notAvailableSearchString);
                            }

                            product.updatedAt = new Date();

                            product.save();
                        }
                    });
                });
            }
        });
    }
}
