import { Controller, Get, Post, Query, Body, Param, ParseIntPipe,  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

type BookAppointmentBody = {
  date: string;
  time: string;
};

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

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findById(id);
  }

  @Post()
  bookAppointment(@Body() body: BookAppointmentBody) {
    return this.appointmentsService.bookAppointment(body);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.deleteById(id);
  }
}
