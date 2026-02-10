import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleHistory } from '../entities/vehicle-history';
import { VehicleCurrent } from '../entities/vehicle-current';
import { MeterHistory } from '../entities/meter-history';
import { MeterCurrent } from '../entities/meter-current';
import { IngestDto } from './dto/ingestion.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(VehicleHistory)
    private vehicleHistoryRepo: Repository<VehicleHistory>,
    @InjectRepository(VehicleCurrent)
    private vehicleCurrentRepo: Repository<VehicleCurrent>,
    @InjectRepository(MeterHistory)
    private meterHistoryRepo: Repository<MeterHistory>,
    @InjectRepository(MeterCurrent)
    private meterCurrentRepo: Repository<MeterCurrent>,
  ) {}

  async ingest(data: IngestDto): Promise<void> {
    // Implementation here
  }
}