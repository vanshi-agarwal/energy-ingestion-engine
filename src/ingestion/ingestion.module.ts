import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

import { VehicleHistory } from '../entities/vehicle-history';
import { VehicleCurrent } from '../entities/vehicle-current';
import { MeterHistory } from '../entities/meter-history';
import { MeterCurrent } from '../entities/meter-current';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleHistory,
      VehicleCurrent,
      MeterHistory,
      MeterCurrent,
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}