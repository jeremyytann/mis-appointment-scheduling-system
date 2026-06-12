import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {

  constructor(private readonly settingsService: SettingsService) {}

  @Get('slot-duration')
  getSlotDuration() {
    return this.settingsService.getSlotDuration();
  }

  @Patch('slot-duration')
  updateSlotDuration(@Body() body: { value: number }) {
    return this.settingsService.updateSlotDuration(body.value);
  }

  @Get('slot-capacity')
  getSlotCapacity() {
    return this.settingsService.getSlotCapacity();
  }

  @Patch('slot-capacity')
  updateSlotCapacity(@Body() body: { value: number }) {
    return this.settingsService.updateSlotCapacity(body.value);
  }
}