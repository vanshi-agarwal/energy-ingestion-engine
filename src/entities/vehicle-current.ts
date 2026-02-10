import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class VehicleCurrent {
  @PrimaryColumn()
  vehicleId: string;

  @Column('int')
  soc: number;

  @Column('float')
  batteryTemp: number;

  @Column()
  lastUpdated: Date;
}