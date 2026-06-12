import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';

@Controller('settings')
export class SettingsController {

  constructor(private readonly settingsService: SettingsService) {}

  @Get('slot-duration')
  getSlotDuration() {
    return this.settingsService.getSlotDuration();
  }

  @Patch('slot-duration')
  updateSlotDuration(@Body() body: { value: number }) {
    return this.settingsService.updateSlotDuration(body?.value);
  }

  @Get('slot-capacity')
  getSlotCapacity() {
    return this.settingsService.getSlotCapacity();
  }

  @Patch('slot-capacity')
  updateSlotCapacity(@Body() body: { value: number }) {
    return this.settingsService.updateSlotCapacity(body?.value);
  }

  @Get('working-hours')
  getWorkingHours() {
    return this.settingsService.getWorkingHours();
  }

  @Patch('working-hours')
  updateWorkingHours(@Body() dto: UpdateWorkingHoursDto) {
    return this.settingsService.updateWorkingHours(dto?.start, dto?.end);
  }

  @Get('working-days')
  getWorkingDays() {
    return this.settingsService.getWorkingDays();
  }

  @Patch('working-days')
  updateWorkingDays(@Body() body: { days: string[] }) {
    return this.settingsService.updateWorkingDays(body?.days);
  }
}