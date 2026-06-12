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
    const bookedSlots = await this.getBookedSlots(date);
  
    return {
      date,
      slots: await this.generateSlots(date, bookedSlots),
    };
  }

  private async getBookedSlots(date: string) {
    const appointments = await this.em.find(Appointment, { date });
  
    return appointments.map(a => a.startTime);
  }

  private async generateSlots(date: string, bookedSlots: string[]) {
    const slots: any[] = [];
  
    const duration = (await this.settingsService.getSlotDuration()).value;

    if (!duration || duration < 5) {
      throw new BadRequestException('Invalid slot duration config');
    }
    
    let start = 9 * 60;
    const end = 18 * 60;
  
    while (start < end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
  
      const time = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
  
      const isBooked = bookedSlots.includes(time);
  
      slots.push({
        date,
        time,
        available_slots: isBooked ? 0 : 1,
      });
  
      start += duration;
    }
  
    return slots;
  }

  async bookAppointment(dto: { date: string; time: string }) {
    const { date, time } = dto;
  
    // Check if appointment isalready booked
    const existing = await this.em.findOne(Appointment, { date, startTime: time });
  
    if (existing) {
      throw new BadRequestException('Slot already booked');
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
