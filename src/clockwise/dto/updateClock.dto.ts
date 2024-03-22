import { PartialType } from '@nestjs/mapped-types';
import { CreateClockDto } from './createClock.dto';

export class UpdateClockDto extends PartialType(CreateClockDto) {}
