import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@Controller('appointments')
export class AppointmentsController {

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('slots')
  getAvailableSlots(@Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(date);
  }
}
