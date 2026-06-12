import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Appointment {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();
}