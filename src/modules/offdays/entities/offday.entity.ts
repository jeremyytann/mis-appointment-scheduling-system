import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Offday {
  
  [OptionalProps]?: 'isActive' | 'createdAt';

  @PrimaryKey()
  id!: number;

  @Property()
  date!: string;

  @Property()
  name!: string;

  @Property({ default: true })
  isActive!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}