import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleHistory } from '../entities/vehicle-history';
import { VehicleCurrent } from '../entities/vehicle-current';
import { MeterHistory } from '../entities/meter-history';
import { MeterCurrent } from '../entities/meter-current';

describe('IngestionService', () => {
  let service: IngestionService;
  let vehicleHistoryRepo: any;
  let vehicleCurrentRepo: any;
  let meterHistoryRepo: any;
  let meterCurrentRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(VehicleHistory),
          useValue: { save: jest.fn(), find: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(VehicleCurrent),
          useValue: { save: jest.fn(), find: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(MeterHistory),
          useValue: { save: jest.fn(), find: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(MeterCurrent),
          useValue: { save: jest.fn(), find: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    vehicleHistoryRepo = module.get(getRepositoryToken(VehicleHistory));
    vehicleCurrentRepo = module.get(getRepositoryToken(VehicleCurrent));
    meterHistoryRepo = module.get(getRepositoryToken(MeterHistory));
    meterCurrentRepo = module.get(getRepositoryToken(MeterCurrent));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have an ingest method', () => {
    expect(service.ingest).toBeDefined();
  });

  describe('ingest', () => {
    it('should call vehicle repositories for VEHICLE type', async () => {
      const mockData = {
        vehicleId: '1',
        type: 'VEHICLE' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        soc: 80,
        batteryTemp: 25.5,
        kwhDeliveredDc: 50.5,
      };

      vehicleCurrentRepo.save.mockResolvedValue({});
      vehicleHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(vehicleCurrentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: '1',
          soc: 80,
          batteryTemp: 25.5,
          lastUpdated: expect.any(Date),
        }),
      );
      expect(vehicleHistoryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: '1',
          kwhDeliveredDc: 50.5,
          batteryTemp: 25.5,
          soc: 80,
          timestamp: expect.any(Date),
        }),
      );
    });

    it('should call meter repositories for METER type', async () => {
      const mockData = {
        meterId: '1',
        type: 'METER' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        voltage: 220,
        kwhConsumedAc: 100.5,
      };

      meterCurrentRepo.save.mockResolvedValue({});
      meterHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(meterCurrentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          meterId: '1',
          voltage: 220,
          lastUpdated: expect.any(Date),
        }),
      );
      expect(meterHistoryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          meterId: '1',
          kwhConsumedAc: 100.5,
          voltage: 220,
          timestamp: expect.any(Date),
        }),
      );
    });

    it('should handle invalid data type', async () => {
      const mockData = {
        type: 'INVALID' as any,
        timestamp: new Date().toISOString(),
      };

      await service.ingest(mockData);

      expect(vehicleCurrentRepo.save).not.toHaveBeenCalled();
      expect(meterCurrentRepo.save).not.toHaveBeenCalled();
    });

    it('should handle errors when saving to vehicle repositories', async () => {
      const mockData = {
        vehicleId: '1',
        type: 'VEHICLE' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        soc: 80,
        batteryTemp: 25.5,
        kwhDeliveredDc: 50.5,
      };

      vehicleCurrentRepo.save.mockRejectedValue(new Error('Database error'));

      await expect(service.ingest(mockData)).rejects.toThrow('Database error');
    });

    it('should handle errors when saving to meter repositories', async () => {
      const mockData = {
        meterId: '1',
        type: 'METER' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        voltage: 220,
        kwhConsumedAc: 100.5,
      };

      meterCurrentRepo.save.mockRejectedValue(new Error('Database error'));

      await expect(service.ingest(mockData)).rejects.toThrow('Database error');
    });

    it('should handle both vehicle current and history save failures', async () => {
      const mockData = {
        vehicleId: '1',
        type: 'VEHICLE' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        soc: 80,
        batteryTemp: 25.5,
        kwhDeliveredDc: 50.5,
      };

      vehicleHistoryRepo.save.mockRejectedValue(new Error('History save failed'));

      await expect(service.ingest(mockData)).rejects.toThrow('History save failed');
    });

    it('should not call meter repositories when ingesting vehicle data', async () => {
      const mockData = {
        vehicleId: '1',
        type: 'VEHICLE' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        soc: 80,
        batteryTemp: 25.5,
        kwhDeliveredDc: 50.5,
      };

      vehicleCurrentRepo.save.mockResolvedValue({});
      vehicleHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(meterCurrentRepo.save).not.toHaveBeenCalled();
      expect(meterHistoryRepo.save).not.toHaveBeenCalled();
    });

    it('should not call vehicle repositories when ingesting meter data', async () => {
      const mockData = {
        meterId: '1',
        type: 'METER' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        voltage: 220,
        kwhConsumedAc: 100.5,
      };

      meterCurrentRepo.save.mockResolvedValue({});
      meterHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(vehicleCurrentRepo.save).not.toHaveBeenCalled();
      expect(vehicleHistoryRepo.save).not.toHaveBeenCalled();
    });

    it('should handle null or undefined type gracefully', async () => {
      const mockData = {
        type: null as any,
        timestamp: new Date().toISOString(),
      };

      await service.ingest(mockData);

      expect(vehicleCurrentRepo.save).not.toHaveBeenCalled();
      expect(meterCurrentRepo.save).not.toHaveBeenCalled();
    });

    it('should save to both current and history for meter data', async () => {
      const mockData = {
        meterId: '2',
        type: 'METER' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        voltage: 230,
        kwhConsumedAc: 150.75,
      };

      meterCurrentRepo.save.mockResolvedValue({});
      meterHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(meterCurrentRepo.save).toHaveBeenCalledTimes(1);
      expect(meterHistoryRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should save to both current and history for vehicle data', async () => {
      const mockData = {
        vehicleId: '2',
        type: 'VEHICLE' as 'VEHICLE' | 'METER',
        timestamp: new Date().toISOString(),
        soc: 95,
        batteryTemp: 30,
        kwhDeliveredDc: 75,
      };

      vehicleCurrentRepo.save.mockResolvedValue({});
      vehicleHistoryRepo.save.mockResolvedValue({});

      await service.ingest(mockData);

      expect(vehicleCurrentRepo.save).toHaveBeenCalledTimes(1);
      expect(vehicleHistoryRepo.save).toHaveBeenCalledTimes(1);
    });
  });
});