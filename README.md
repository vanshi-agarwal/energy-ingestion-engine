# Energy Ingestion Engine

A NestJS-based API for ingesting and analyzing electric vehicle charging data.

## Architecture Overview

This application provides two main functionalities:
1. **Data Ingestion**: POST endpoint to ingest vehicle and meter data
2. **Analytics**: GET endpoint to analyze vehicle performance over the last 24 hours

### Database Schema

**Entities:**
- `VehicleHistory`: Historical vehicle charging data
- `VehicleCurrent`: Current vehicle state
- `MeterHistory`: Historical meter readings
- `MeterCurrent`: Current meter state

## API Endpoints

### 1. Ingest Data
```
POST /v1/ingest
```

**Request Body:**
```json
{
  "type": "VEHICLE",
  "vehicleId": "1",
  "soc": 80,
  "batteryTemp": 25.5,
  "kwhDeliveredDc": 50.5,
  "timestamp": "2024-02-10T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Data ingested successfully"
}
```

### 2. Get Vehicle Performance Analytics
```
GET /v1/analytics/performance/vehicleid?vehicleId=1
```

**Response:**
```json
{
  "vehicleId": "1",
  "sumDC": 150.75,
  "sumAC": 175.50,
  "efficiency": 85.90,
  "avgBatteryTemp": 26.30
}
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd energy-ingestion-engine
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=energy_db
```

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure
```
src/
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
├── entities/
│   ├── vehicle-history.ts
│   ├── vehicle-current.ts
│   ├── meter-history.ts
│   └── meter-current.ts
├── ingestion/
│   ├── dto/
│   │   └── ingestion.dto.ts
│   ├── ingestion.controller.ts
│   ├── ingestion.service.ts
│   └── ingestion.module.ts
├── app.module.ts
└── main.ts
```

## Insert vs Upsert Strategy

- **VehicleHistory & MeterHistory**: Uses `INSERT` (repository.save()) for historical records
- **VehicleCurrent & MeterCurrent**: Uses `UPSERT` (repository.save() with primary key) to update current state

## How to Run the Project

1. Ensure PostgreSQL is running
2. Create the database specified in `.env`
3. Start the application: `npm run start:dev`
4. The API will be available at `http://localhost:3000`

## Scalability Considerations (14.4M rows/day)

To handle high throughput:
- Use batch inserts for better performance
- Implement connection pooling
- Consider using time-series database for historical data
- Add caching layer (Redis) for analytics
- Implement message queue (RabbitMQ/Kafka) for async processing

## License
MIT