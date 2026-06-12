import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('slots')
  getAvailableSlots(@Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(date);
  }

  @Post()
  bookAppointment(@Body() body: any) {
    return this.appointmentsService.bookAppointment(body);
  }
}
