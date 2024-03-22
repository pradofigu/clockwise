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
import { ClockService } from './clockService';
import { CreateClockDto } from './dto/create-clock.dto';
import { UpdateClockDto } from './dto/update-clock.dto';

@Controller('clockings')
export class ClockController {
  constructor(private readonly service: ClockService) {}

  @Post()
  create(@Body() dto: CreateClockDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  findByDate(@Query('startDate') startDate?: string) {
    if (startDate) {
      return this.service.findByDate(new Date(startDate));
    } else {
      return this.service.findAll();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClockDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
