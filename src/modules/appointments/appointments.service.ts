import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { EntityManager } from '@mikro-orm/core';
import { SettingsService } from '../settings/settings.service';
import { OffdaysService } from '../offdays/offdays.service';

type Slot = {
  date: string;
  time: string;
  available_slots: number;
};

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly offdaysService: OffdaysService,
    private readonly settingsService: SettingsService,
    private readonly em: EntityManager
  ) {}

  async getAvailableSlots(date: string) {
    const offday = await this.offdaysService.findByDate(date);

    if (offday) {
      return {
        isOffday: true,
        offdayName: offday.name,
        slots: [],
      };
    }

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

    const { start, end } = await this.settingsService.getWorkingHours();
  
    if (!duration || duration < 5) {
      throw new BadRequestException('Invalid slot duration config');
    }

    if (!capacity || capacity < 1) {
      throw new BadRequestException('Invalid slot capacity config');
    }

    const workingDays = (await this.settingsService.getWorkingDays()).value;

    const dateObj = new Date(date);
    const dayMap = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const day = dayMap[dateObj.getDay()];

    if (!workingDays.includes(day)) {
      return [];
    }

    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    let current = sh * 60 + sm;
    const endMin = eh * 60 + em;
  
    const slotCounts = await this.getSlotCounts(date);
  
    while (current < endMin) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;

      const time = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;

      const bookedCount = slotCounts.get(time) || 0;
      const available = Math.max(capacity - bookedCount, 0);

      slots.push({
        date,
        time,
        available_slots: available,
      });

      current += duration;
    }
  
    return slots;
  }

  async bookAppointment(dto: { date: string; time: string }) {
    const { date, time } = dto;

    const offday = await this.offdaysService.findByDate(date);

    if (offday) {
      throw new BadRequestException(
        `Cannot book on off day: ${offday.name}`
      );
    }
  
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
