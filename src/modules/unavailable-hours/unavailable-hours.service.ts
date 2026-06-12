import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UnavailableHour } from './entities/unavailable-hour.entity';
import { EntityRepository } from '@mikro-orm/core';
import { isValidTimeFormat } from '../../common/utils/time.util';

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

@Injectable()
export class UnavailableHoursService {
  constructor(
    @InjectRepository(UnavailableHour)
    private readonly repo: EntityRepository<UnavailableHour>,
  ) {}

  async create(dto: { startTime: string; endTime: string }) {
    if (
      !dto ||
      !dto.startTime ||
      !dto.endTime ||
      !isValidTimeFormat(dto.startTime) ||
      !isValidTimeFormat(dto.endTime)
    ) {
      throw new BadRequestException('Unavailable hours must be in HH:mm format');
    }

    if (toMinutes(dto.startTime) >= toMinutes(dto.endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }

    const entity = this.repo.create(dto);
    await this.repo.getEntityManager().persistAndFlush(entity);
  
    return entity;
  }

  async findAll() {
    return this.repo.find({ isActive: true });
  }

  async findAllActive() {
    return this.repo.find({ isActive: true });
  }

  async deleteById(id: number) {
    const offdays = await this.repo.findOne({ id });
  
    if (!offdays) {
      throw new BadRequestException('Unavailable hour not found');
    }
  
    await this.repo.getEntityManager().removeAndFlush(offdays);
  
    return {
      message: 'Unavailable hour deleted successfully',
    };
  }
}
