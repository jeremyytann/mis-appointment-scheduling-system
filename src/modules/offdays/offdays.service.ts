import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Offday } from './entities/offday.entity';

@Injectable()
export class OffdaysService {
  constructor(
    @InjectRepository(Offday)
    private readonly offDayRepo: EntityRepository<Offday>,
  ) {}

  async create(date: string, name: string) {
    const offdays = this.offDayRepo.create({ date, name });
    await this.offDayRepo.getEntityManager().persistAndFlush(offdays);
    return offdays;
  }
  
  async findAll() {
    return this.offDayRepo.find({ isActive: true });
  }
  
  async findByDate(date: string) {
    return this.offDayRepo.findOne({ date });
  }

  async deleteById(id: number) {
    const offdays = await this.offDayRepo.findOne({ id });
  
    if (!offdays) {
      throw new BadRequestException('Off day not found');
    }
  
    await this.offDayRepo.getEntityManager().removeAndFlush(offdays);
  
    return {
      message: 'Off day deleted successfully',
    };
  }
}