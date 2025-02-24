import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestsDto } from './dto/create-requests.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getAllRequests() {
    return this.requestsService.getAllRequests();
  }
  @Post()
  async createRequest(@Body() dto: CreateRequestsDto) {
    return this.requestsService.createRequest(dto);
  }
}
