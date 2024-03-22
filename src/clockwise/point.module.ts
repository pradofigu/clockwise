import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clockwise } from './entities/clockwise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clockwise])],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
