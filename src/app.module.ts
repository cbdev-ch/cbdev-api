import { Module } from '@nestjs/common';
import { ReminderModule } from './reminder/reminder.module';

@Module({
  imports: [ReminderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
