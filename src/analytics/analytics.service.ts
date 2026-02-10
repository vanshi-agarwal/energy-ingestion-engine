import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { VehicleHistory } from '../entities/vehicle-history';
import { MeterHistory } from '../entities/meter-history';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleHistory)
    private vehicleHistoryRepo: Repository<VehicleHistory>,
    @InjectRepository(MeterHistory)
    private meterHistoryRepo: Repository<MeterHistory>,
  ) {}

  async getVehiclePerformance(vehicleId: string) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Fetch vehicle data from last 24 hours
    const vehicleData = await this.vehicleHistoryRepo.find({
      where: {
        vehicleId,
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
    });

    if (vehicleData.length === 0) {
      return {
        vehicleId,
        message: 'No data found for the last 24 hours',
      };
    }

    // Calculate sum of DC delivered
    const sumDC = vehicleData.reduce(
      (sum, record) => sum + record.kwhDeliveredDc,
      0,
    );

    // Calculate average battery temperature
    const avgBatteryTemp =
      vehicleData.reduce((sum, record) => sum + record.batteryTemp, 0) /
      vehicleData.length;

    // Fetch meter data from last 24 hours
    const meterData = await this.meterHistoryRepo.find({
      where: {
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
    });

    // Calculate sum of AC consumed
    const sumAC = meterData.reduce(
      (sum, record) => sum + record.kwhConsumedAc,
      0,
    );

    // Calculate efficiency
    const efficiency = sumAC > 0 ? (sumDC / sumAC) * 100 : 0;

    return {
      vehicleId,
      sumDC: parseFloat(sumDC.toFixed(2)),
      sumAC: parseFloat(sumAC.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(2)),
      avgBatteryTemp: parseFloat(avgBatteryTemp.toFixed(2)),
    };
  }
}