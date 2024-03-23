import { Injectable } from '@nestjs/common';
import { CreateClockDto } from '../dto/create-clock.dto';
import { UpdateClockDto } from '../dto/update-clock.dto';
import { Between, Repository } from 'typeorm';
import { ClockEntity, ClockType } from '../persistence/entities/clock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Clock } from './model/clock';
import { ClockCalculator } from '../../utils/clock-calculator';

@Injectable()
export class ClockService {
  constructor(
    @InjectRepository(ClockEntity)
    private readonly repository: Repository<ClockEntity>,
  ) {}

  async create(dto: CreateClockDto): Promise<ClockEntity> {
    const createdEntity = this.repository.create(dto);
    const result = this.repository.save(createdEntity);

    return result
      .then((res) => res)
      .catch((err) => {
        throw new Error(`Error while creating a new clockwise: ${err}`);
      });
  }

  findAll(): Promise<ClockEntity[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<ClockEntity> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByDate(date: Date): Promise<Clock> {
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
    const clocksByUser: { [userId: string]: Clock } = {};
    let lastClockInTime: Date | null = null;

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
        lastClockInTime = new Date(clock.time);
      }
    });

    const inWorking = lastClockInTime
      ? ClockCalculator.getWorkedTimeAmount(clocks)
      : '00:00:00';

    /*
     * Removes the first item of the list to enter in 'shouldCalculateLastClock'
     * rule, in order to calculate interval in real-time just as 'inWorking'
     */
    const intervalTime = ClockCalculator.getInterval(clocks.slice(1));

    Object.values(clocksByUser).forEach((userClocks) => {
      userClocks.inWorking = inWorking;
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
