import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { VehicleHistory } from '../entities/vehicle-history';
import { MeterHistory } from '../entities/meter-history';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleHistory, MeterHistory])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}