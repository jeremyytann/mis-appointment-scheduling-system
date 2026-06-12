import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Setting } from './entities/setting.entity';
import { DEFAULT_SLOT_CAPACITY, DEFAULT_SLOT_DURATION, DEFAULT_WORKING_DAYS, DEFAULT_WORKING_END, DEFAULT_WORKING_START, MAX_SLOT_CAPACITY, MIN_SLOT_CAPACITY, MIN_SLOT_DURATION } from '../../config/defaults';

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

@Injectable()
export class SettingsService {

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: EntityRepository<Setting>,
  ) {}

  async getSlotDuration(): Promise<{ value: number }> {
    const setting = await this.settingRepo.findOne({ key: 'slot_duration' });

    return {
      value: Number(setting?.value ?? DEFAULT_SLOT_DURATION),
    };
  }

  async updateSlotDuration(value: number) {

    if (value < MIN_SLOT_DURATION) {
      throw new BadRequestException('Minimum slot duration is 5 minutes');
    }

    let setting = await this.settingRepo.findOne({ key: 'slot_duration' });

    if (!setting) {
      setting = this.settingRepo.create({
        key: 'slot_duration',
        value: String(value),
      });
    } else {
      setting.value = String(value);
    }

    await this.settingRepo.getEntityManager().persistAndFlush(setting);

    return {
      message: 'Slot duration updated',
      value,
    };
  }

  async getSlotCapacity(): Promise<{ value: number }> {
    const setting = await this.settingRepo.findOne({
      key: 'slot_capacity',
    });

    return {
      value: Number(setting?.value ?? DEFAULT_SLOT_CAPACITY),
    };
  }

  async updateSlotCapacity(value: number) {

    if (value < MIN_SLOT_CAPACITY || value > MAX_SLOT_CAPACITY) {
      throw new BadRequestException('Capacity must be between 1 and 5');
    }
  
    let setting = await this.settingRepo.findOne({
      key: 'slot_capacity',
    });
  
    if (!setting) {
      setting = this.settingRepo.create({
        key: 'slot_capacity',
        value: String(value),
      });
    } else {
      setting.value = String(value);
    }
  
    await this.settingRepo.getEntityManager().persistAndFlush(setting);
  
    return {
      message: 'Slot capacity updated',
      value,
    };
  }

  async getWorkingHours() {
    const start = await this.settingRepo.findOne({ key: 'working_hours_start' });
    const end = await this.settingRepo.findOne({ key: 'working_hours_end' });
  
    return {
      start: start?.value ?? DEFAULT_WORKING_START,
      end: end?.value ?? DEFAULT_WORKING_END,
    };
  }

  async updateWorkingHours(start: string, end: string) {
    if (!start || !end) {
      throw new BadRequestException('Start and end time are required');
    }
  
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
  
    if (startMin >= endMin) {
      throw new BadRequestException('Start time must be before end time');
    }
  
    // save start
    await this.upsertSetting('working_hours_start', start);
  
    // save end
    await this.upsertSetting('working_hours_end', end);
  
    return {
      message: 'Working hours updated',
      start,
      end,
    };
  }

  async getWorkingDays(): Promise<{ value: string[] }> {
    const setting = await this.settingRepo.findOne({ key: 'working_days' });
  
    return {
      value: setting?.value
        ? setting.value.split(',')
        : DEFAULT_WORKING_DAYS
    };
  }

  async updateWorkingDays(days: string[]) {
    const allowed = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  
    for (const d of days) {
      if (!allowed.includes(d)) {
        throw new BadRequestException('Invalid working day');
      }
    }
  
    let setting = await this.settingRepo.findOne({ key: 'working_days' });
  
    if (!setting) {
      setting = this.settingRepo.create({
        key: 'working_days',
        value: days.join(','),
      });
    } else {
      setting.value = days.join(',');
    }
  
    await this.settingRepo.getEntityManager().persistAndFlush(setting);
  
    return {
      message: 'Working days updated',
      value: days,
    };
  }

  private async upsertSetting(key: string, value: string) {
    let setting = await this.settingRepo.findOne({ key });
  
    if (!setting) {
      setting = this.settingRepo.create({ key, value });
    } else {
      setting.value = value;
    }
  
    await this.settingRepo.getEntityManager().persistAndFlush(setting);
  }
}