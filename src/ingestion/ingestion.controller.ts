import { Controller, Post, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestDto } from './dto/ingestion.dto';

@Controller('v1/ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  ingest(@Body() payload: IngestDto) {
    return this.ingestionService.ingest(payload);
  }
}