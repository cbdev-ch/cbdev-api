import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {

    constructor(private discountService: DiscountsService) {
    }

    @Get('categories')
    async getCategories() {
        return this.discountService.getCategories();
    }

    @Get(':category')
    async getAll(@Param('category') category) {
        return this.discountService.getAll(category);
    }
}
