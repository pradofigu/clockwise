import { Point } from '../clockwise/entities/point.entity';

export class ClockCalculator {
  static getWorkedTimeAmount(clocks: Point[]): string {
    const timeInMillis = this.calculateTime(clocks, 'entrance');

    return this.formatTime(timeInMillis);
  }

  static getInterval(clocks: Point[]): string {
    const timeInMillis = this.calculateTime(clocks, 'exit');

    return this.formatTime(timeInMillis);
  }

  private static calculateTime(
    clocks: Point[],
    pointType: 'entrance' | 'exit',
  ): number {
    let timeInMillis = 0;
    const adjustment = (index: number) =>
      index + (pointType === 'entrance' ? 0 : 1);

    for (let i = adjustment(0); i < clocks.length - 1; i += 2) {
      const start = new Date(clocks[i].time);
      const end = new Date(clocks[i + 1].time);
      timeInMillis += end.getTime() - start.getTime();
    }

    if (this.shouldCalculateLastClock(clocks, pointType)) {
      const lastClock = new Date(clocks[clocks.length - 1].time);
      const currentTime = new Date();
      timeInMillis += currentTime.getTime() - lastClock.getTime();
    }

    return timeInMillis;
  }

  /**
   * Calculates the time difference when:
   * 1. Clocks' length is even and last clock is 'clock out'
   * 2. Clocks' length is odd and last clock is 'clock in'
   * */
  private static shouldCalculateLastClock(
    clocks: Point[],
    pointType: 'entrance' | 'exit',
  ): boolean {
    return (
      clocks.length % 2 !== 0 &&
      clocks[clocks.length - 1].pointType === pointType
    );
  }

  private static formatTime(timeInMillis: number): string {
    const seconds = timeInMillis / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
