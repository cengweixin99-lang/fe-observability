import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { IngestionService } from "./ingestion.service.js";

@Controller("v1/ingest")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}
  
  @Post()
  @HttpCode(202)
  ingest(@Body() body: unknown) {
    return this.ingestionService.ingest(body);
  }
}