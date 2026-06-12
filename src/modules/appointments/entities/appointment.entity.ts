import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Appointment {

  @PrimaryKey()
  id!: number;

  @Property()
  date!: string; // e.g. "2026-06-12"

  @Property()
  startTime!: string; // e.g. "10:00"

  @Property()
  endTime!: string; // e.g. "10:30"

  @Property({ default: true })
  isActive!: boolean;

  @Property()
  createdAt: Date = new Date();
}