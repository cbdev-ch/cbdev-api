import {Controller, Get} from '@nestjs/common';
import {RedbullDiscountService} from './redbull-discount.service';

@Controller('reminder/redbull/discount')
export class RedbullDiscountController {

    constructor(private redbullDiscountService: RedbullDiscountService) {}

    @Get()
    lol(){
        this.redbullDiscountService.test();
    }

}
