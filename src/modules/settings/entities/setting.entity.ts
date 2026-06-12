import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Setting {

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  key!: string;

  @Property()
  value!: string;
}