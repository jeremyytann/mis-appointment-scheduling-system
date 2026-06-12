import { Body, Controller, Get, Post, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { OffdaysService } from './offdays.service';

@Controller('offdays')
export class OffdaysController {
  constructor(private readonly offdaysService: OffdaysService) {}

  @Post()
  create(@Body() body: { date: string; name: string }) {
    return this.offdaysService.create(body.date, body.name);
  }

  @Get()
  findAll() {
    return this.offdaysService.findAll();
  }

  @Delete(':id')
  deleteHoliday(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.offdaysService.deleteById(id);
  }
}