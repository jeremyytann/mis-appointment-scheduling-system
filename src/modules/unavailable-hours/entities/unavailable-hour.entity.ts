import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class UnavailableHour {
    
  [OptionalProps]?: 'isActive' | 'createdAt';

  @PrimaryKey()
  id!: number;

  @Property()
  startTime!: string; // HH:mm

  @Property()
  endTime!: string; // HH:mm

  @Property({ default: true })
  isActive!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}