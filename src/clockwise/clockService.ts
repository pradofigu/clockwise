import { Injectable } from '@nestjs/common';
import { CreateClockDto } from './dto/create-clock.dto';
import { UpdateClockDto } from './dto/update-clock.dto';
import { Between, Repository } from 'typeorm';
import { Clockwise, ClockType } from './entities/clockwise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClockResponse } from './interface/clock.interface';
import { ClockCalculator } from 'src/utils/clockCalculator';

@Injectable()
export class ClockService {
  constructor(
    @InjectRepository(Clockwise)
    private readonly repository: Repository<Clockwise>,
  ) {}

  async create(dto: CreateClockDto): Promise<Clockwise> {
    const createdEntity = this.repository.create(dto);
    const result = this.repository.save(createdEntity);

    return result
      .then((res) => res)
      .catch((err) => {
        throw new Error(`Error while creating a new clockwise: ${err}`);
      });
  }

  findAll(): Promise<Clockwise[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Clockwise> {
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

    Object.values(clocksByUser).forEach((userClocks) => {
      userClocks.inWorking = inWorkingTime;
      userClocks.interval = intervalTime;
    });

    return Object.values(clocksByUser)[0];
  }

  async update(id: string, dto: UpdateClockDto): Promise<boolean> {
    const result = this.repository.update({ id }, dto);

    return await result
      .then(() => true)
      .catch((err) => {
        console.error(`Error while updating a clockwise for the id ${id}`, err);
        return false;
      });
  }

  async delete(id: string): Promise<boolean> {
    const result = this.repository.delete({ id });

    return await result
      .then(() => true)
      .catch((err) => {
        console.error(`Error while deleting a clockwise for the id ${id}`, err);
        return false;
      });
  }
}
