import { Module } from '@nestjs/common';
import { ClockService } from './usecase/clock.service';
import { ClockController } from './controller/clock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockEntity } from './persistence/entities/clock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClockEntity])],
  controllers: [ClockController],
  providers: [ClockService],
})
export class ClockModule {}
