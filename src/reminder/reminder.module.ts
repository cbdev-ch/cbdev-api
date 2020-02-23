import { Module } from '@nestjs/common';
import { RedbullDiscountController } from './redbull-discount/redbull-discount.controller';
import { RedbullDiscountService } from './redbull-discount/redbull-discount.service';

@Module({
  controllers: [RedbullDiscountController],
  providers: [RedbullDiscountService]
})
export class ReminderModule {}
