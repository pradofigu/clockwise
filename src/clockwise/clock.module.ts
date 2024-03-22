import { Module } from '@nestjs/common';
import { ClockService } from './clockService';
import { ClockController } from './clockController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clockwise } from './entities/clockwise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clockwise])],
  controllers: [ClockController],
  providers: [ClockService],
})
export class ClockModule {}
