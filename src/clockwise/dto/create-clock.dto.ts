import { Transform } from 'class-transformer';
import { ClockType } from '../entities/clockwise.entity';
import { IsEnum } from 'class-validator';

export class CreateClockDto {
  @Transform(({ value }) => ClockType[value as keyof typeof ClockType])
  @IsEnum(ClockType, {
    message: 'clockType must be either "Clock In" or "Clock Out"',
  })
  clockType: ClockType;

  time: Date;

  userId: string;
}
