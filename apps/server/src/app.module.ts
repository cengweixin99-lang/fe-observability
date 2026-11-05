import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { IngestionModule } from './ingestion/ingestion.module.js';

@Module({
  imports: [HealthModule, IngestionModule],
})
export class AppModule {}
