export class DateIntervalCalculator {
  static calculateInWorkingTime(points: any[]): string {
    let totalMilliseconds = 0;

    for (let i = 0; i < points.length - 1; i += 2) {
      const entranceTime = new Date(points[i].time);
      const exitTime = new Date(points[i + 1].time);
      totalMilliseconds += exitTime.getTime() - entranceTime.getTime();
    }

    // Se o número de pontos for ímpar e o último for entrance, calcule sua diferença
    if (
      points.length % 2 !== 0 &&
      points[points.length - 1].pointType === 'entrance'
    ) {
      const lastEntranceTime = new Date(points[points.length - 1].time);
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() - 3);
      totalMilliseconds += currentTime.getTime() - lastEntranceTime.getTime();
    }

    const totalSeconds = totalMilliseconds / 1000;
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSecondsRemainder = Math.floor(totalSeconds % 60);

    return `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSecondsRemainder.toString().padStart(2, '0')}`;
  }

  static calculateIntervalTime(points: any[]): string {
    let totalMilliseconds = 0;

    for (let i = 1; i < points.length - 1; i += 2) {
      const exitTime = new Date(points[i].time);
      const entranceTime = new Date(points[i + 1].time);
      totalMilliseconds += entranceTime.getTime() - exitTime.getTime();
    }

    // Se o número de pontos for par e o último for exit, calcule sua diferença
    if (points.length !== 0 && points[points.length - 1].pointType === 'exit') {
      const lastExitTime = new Date(points[points.length - 1].time);
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() - 3);
      totalMilliseconds += currentTime.getTime() - lastExitTime.getTime();
    }

    const totalSeconds = totalMilliseconds / 1000;
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSecondsRemainder = Math.floor(totalSeconds % 60);

    return `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSecondsRemainder.toString().padStart(2, '0')}`;
  }
}
