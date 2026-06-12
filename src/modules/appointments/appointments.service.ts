import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { EntityRepository } from '@mikro-orm/core';

type Slot = {
  date: string;
  time: string;
  available_slots: number;
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: EntityRepository<Appointment>,
  ) {}

  async getAvailableSlots(date: string) {
    const bookedSlots = await this.getBookedSlots(date);
  
    return {
      date,
      slots: this.generateSlots(date, bookedSlots),
    };
  }

  private async getBookedSlots(date: string) {
    const appointments = await this.appointmentRepo.find({ date });
  
    return appointments.map(a => a.startTime);
  }

  private generateSlots(date: string, bookedSlots: string[]) {
    const slots: any[] = [];
  
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
  
      start += 30;
    }
  
    return slots;
  }
}
