import { Module } from '@nestjs/common';
import { UnavailableHoursService } from './unavailable-hours.service';
import { UnavailableHoursController } from './unavailable-hours.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UnavailableHour } from './entities/unavailable-hour.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UnavailableHour])],
  controllers: [UnavailableHoursController],
  providers: [UnavailableHoursService],
  exports: [UnavailableHoursService],
})
export class UnavailableHoursModule {}