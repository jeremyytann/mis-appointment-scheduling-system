import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { EntityManager } from '@mikro-orm/core';
import { SettingsService } from '../settings/settings.service';

type Slot = {
  date: string;
  time: string;
  available_slots: number;
};

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly em: EntityManager
  ) {}

  async getAvailableSlots(date: string) {
    return {
      date,
      slots: await this.generateSlots(date),
    };
  }

  private async getSlotCounts(date: string) {
    const appointments = await this.em.find(Appointment, { date });
  
    const map = new Map<string, number>();
  
    for (const a of appointments) {
      const time = a.startTime;
      map.set(time, (map.get(time) || 0) + 1);
    }
  
    return map;
  }

  private async generateSlots(date: string) {
    const slots: any[] = [];
  
    const duration = (await this.settingsService.getSlotDuration()).value;
    const capacity = (await this.settingsService.getSlotCapacity()).value;
  
    if (!duration || duration < 5) {
      throw new BadRequestException('Invalid slot duration config');
    }
  
    const slotCounts = await this.getSlotCounts(date);
  
    let start = 9 * 60;
    const end = 18 * 60;
  
    while (start < end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
  
      const time = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
  
      const bookedCount = slotCounts.get(time) || 0;
      const available = Math.max(capacity - bookedCount, 0);
  
      slots.push({
        date,
        time,
        available_slots: available,
      });
  
      start += duration;
    }
  
    return slots;
  }

  async bookAppointment(dto: { date: string; time: string }) {
    const { date, time } = dto;
  
    // Check if appointment isalready booked
    const capacity = (await this.settingsService.getSlotCapacity()).value;

    const count = await this.em.count(Appointment, {
      date,
      startTime: time,
    });
  
    if (count >= capacity) {
      throw new BadRequestException('Slot is fully booked');
    }
  
    // Create new appointment
    const appointment = this.em.create(Appointment, {
      date,
      startTime: time,
      endTime: this.getEndTime(time),
    });
    
    await this.em.persistAndFlush(appointment);
  
    return {
      message: 'Appointment booked successfully',
      data: appointment,
    };
  }

  private getEndTime(startTime: string) {
    const [h, m] = startTime.split(':').map(Number);
  
    const total = h * 60 + m + 30;
  
    const nh = Math.floor(total / 60);
    const nm = total % 60;
  
    return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
  }
}
