import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column('int')
  soc: number;

  @Column()
  timestamp: Date;
}