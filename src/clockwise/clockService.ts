import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Between, Repository } from 'typeorm';
import { Clockwise, ClockType } from './entities/clockwise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClockResponse } from './interface/point.interface';
import { ClockCalculator } from 'src/utils/clockCalculator';

@Injectable()
export class ClockService {
  constructor(
    @InjectRepository(Clockwise)
    private repository: Repository<Clockwise>,
  ) {}

  async create(createPointDto: CreatePointDto) {
    const clockwise = this.repository.create(createPointDto);
    return this.repository.save(clockwise);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByDate(date: Date): Promise<ClockResponse> {
    const startOfDay = new Date(date.toISOString());
    const endOfDay = new Date(date.toISOString());

    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const clocks = await this.repository.find({
      where: {
        time: Between(startOfDay, endOfDay),
      },
      order: {
        time: 'ASC',
      },
    });

    if (clocks.length === 0) return null;

    // Group clocks by user
    const clocksByUser: { [userId: string]: ClockResponse } = {};
    let lastEntranceTime: Date | null = null;

    clocks.forEach((clock) => {
      if (!clocksByUser[clock.userId]) {
        clocksByUser[clock.userId] = {
          userId: clock.userId,
          date: startOfDay.toISOString(),
          interval: '00:00:00',
          inWorking: '00:00:00',
          clock: [],
        };
      }

      clocksByUser[clock.userId].clock.push({
        id: clock.id,
        clockType: clock.clockType,
        time: clock.time.toISOString(),
      });

      if (clock.clockType === ClockType.CLOCK_IN) {
        lastEntranceTime = new Date(clock.time);
      }
    });

    const inWorkingTime = lastEntranceTime
      ? ClockCalculator.getWorkedTimeAmount(clocks)
      : '00:00:00';

    const intervalTime = ClockCalculator.getInterval(clocks);

    Object.values(clocksByUser).forEach((userPoints) => {
      userPoints.inWorking = inWorkingTime;
      userPoints.interval = intervalTime;
    });

    return Object.values(clocksByUser)[0];
  }

  update(id: string, updatePointDto: UpdatePointDto) {
    return this.repository.update({ id }, updatePointDto);
  }

  remove(id: string) {
    return this.repository.delete({ id });
  }
}
