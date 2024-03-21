import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post()
  create(@Body() createPointDto: CreatePointDto) {
    console.log(createPointDto);
    return this.pointService.create(createPointDto);
  }

  @Get()
  findAll() {
    return this.pointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointService.findOne(id);
  }

  @Get('findByDate/:date')
  findByDate(@Param('date') date: string) {
    return this.pointService.findByDate(new Date(date));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointService.update(id, updatePointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointService.remove(id);
  }
}
