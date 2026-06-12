import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Appointment])],
})
export class AppointmentsModule {}
