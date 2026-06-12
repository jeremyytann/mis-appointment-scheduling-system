import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Setting } from './entities/setting.entity';
import { DEFAULT_SLOT_DURATION, MIN_SLOT_DURATION } from '../../config/defaults';

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
}