import {HttpModule, Module} from '@nestjs/common';
import { RedbullDiscountController } from './redbull-discount/redbull-discount.controller';
import { RedbullDiscountService } from './redbull-discount/redbull-discount.service';
import {ScheduleModule} from '@nestjs/schedule';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [RedbullDiscountController],
  providers: [RedbullDiscountService]
})
export class ReminderModule {}
