import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UnavailableHour } from './entities/unavailable-hour.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class UnavailableHoursService {
  constructor(
    @InjectRepository(UnavailableHour)
    private readonly repo: EntityRepository<UnavailableHour>,
  ) {}

  async create(dto: { startTime: string; endTime: string }) {
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
