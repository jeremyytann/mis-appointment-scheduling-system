import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UnavailableHoursService } from './unavailable-hours.service';

@Controller('unavailable-hours')
export class UnavailableHoursController {
  constructor(private readonly unavailableHoursService: UnavailableHoursService) {}

  @Post()
  create(@Body() dto) {
    return this.unavailableHoursService.create(dto);
  }

  @Get()
  findAll() {
    return this.unavailableHoursService.findAll();
  }

  @Delete(':id')
  deleteHoliday(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.unavailableHoursService.deleteById(id);
  }
}
