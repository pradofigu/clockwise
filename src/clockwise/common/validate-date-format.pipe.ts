import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateDateFormatPipe implements PipeTransform<string> {
  /**
   * This function validates is a date follows a pre-defined date format.
   * Format: yyyy-MM-dd
   * */
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) return value; // bypass for optional fields

    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);

    if (!isValidFormat) {
      throw new BadRequestException(
        `The ${metadata.data} must be in the format yyyy-MM-dd`,
      );
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`The ${metadata.data} is not a valid date`);
    }

    return value;
  }
}
