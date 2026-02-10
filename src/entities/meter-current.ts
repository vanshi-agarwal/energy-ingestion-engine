import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class MeterCurrent {
  @PrimaryColumn()
  meterId: string;

  @Column('float')
  voltage: number;

  @Column()
  lastUpdated: Date;
}