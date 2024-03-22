import { Module } from '@nestjs/common';
import { ClockService } from './usecase/clockService';
import { ClockController } from './controller/clockController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clockwise } from './persistence/entities/clockwise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clockwise])],
  controllers: [ClockController],
  providers: [ClockService],
})
export class ClockModule {}
