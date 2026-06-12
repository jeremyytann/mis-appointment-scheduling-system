import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import config from 'mikro-orm.config';
import { SettingsModule } from './modules/settings/settings.module';
import { OffdaysModule } from './modules/offdays/offdays.module';
import { UnavailableHoursModule } from './modules/unavailable-hours/unavailable-hours.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(config),
    AppointmentsModule,
    SettingsModule,
    OffdaysModule,
    UnavailableHoursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
