import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Setting } from './entities/setting.entity';
import { DEFAULT_SLOT_CAPACITY, DEFAULT_SLOT_DURATION, MAX_SLOT_CAPACITY, MIN_SLOT_CAPACITY, MIN_SLOT_DURATION } from '../../config/defaults';

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
}