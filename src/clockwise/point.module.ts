import { Module } from '@nestjs/common';
import { ClockService } from './clockService';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clockwise } from './entities/clockwise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clockwise])],
  controllers: [PointController],
  providers: [ClockService],
})
export class PointModule {}
