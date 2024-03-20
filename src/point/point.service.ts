import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepo: Repository<Point>,
  ) {}

  create(createPointDto: CreatePointDto) {
    const point = this.pointRepo.create(createPointDto);
    return this.pointRepo.save(point);
  }

  findAll() {
    return this.pointRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} point`;
  }

  update(id: number, updatePointDto: UpdatePointDto) {
    return `This action updates a #${id} point`;
  }

  remove(id: number) {
    return `This action removes a #${id} point`;
  }
}
