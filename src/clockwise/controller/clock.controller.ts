import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClockService } from '../usecase/clock.service';
import { CreateClockDto } from '../dto/create-clock.dto';
import { UpdateClockDto } from '../dto/update-clock.dto';

@Controller('clockings')
export class ClockController {
  constructor(private readonly service: ClockService) {}

  @Post()
  async create(@Body() dto: CreateClockDto) {
    return await this.service.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get()
  async findAllOrFiltering(@Query('startDate') startDate?: string) {
    if (startDate) {
      return await this.service.findByDate(new Date(startDate));
    } else {
      return await this.service.findAll();
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClockDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
