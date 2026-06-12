import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { SettingsModule } from '../settings/settings.module';
import { OffdaysModule } from '../offdays/offdays.module';
import { UnavailableHoursModule } from '../unavailable-hours/unavailable-hours.module';

@Module({
  imports: [
    OffdaysModule,
    SettingsModule,
    UnavailableHoursModule,
    MikroOrmModule.forFeature([Appointment])
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
