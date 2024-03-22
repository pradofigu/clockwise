import { Transform } from 'class-transformer';
import { ClockType } from '../persistence/entities/clock.entity';
import { IsEnum } from 'class-validator';

export class CreateClockDto {
  @Transform(({ value }) => ClockType[value as keyof typeof ClockType])
  @IsEnum(ClockType, {
    message: 'clockType must be either "ClockModel In" or "ClockModel Out"',
  })
  clockType: ClockType;

  time: Date;

  userId: string;
}
