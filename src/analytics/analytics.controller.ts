import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance/vehicleid')
  async getVehiclePerformance(@Query('vehicleId') vehicleId: string) {
    return this.analyticsService.getVehiclePerformance(vehicleId);
  }
}