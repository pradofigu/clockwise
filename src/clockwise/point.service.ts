import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Between, Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PointResponse } from './interface/point.interface';
import { DateIntervalCalculator } from 'src/utils/dateIntervalCalculator';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepo: Repository<Point>,
  ) {}

  async create(createPointDto: CreatePointDto) {
    const point = this.pointRepo.create(createPointDto);
    return this.pointRepo.save(point);
  }

  findAll() {
    return this.pointRepo.find();
  }

  findOne(id: string) {
    return this.pointRepo.findOne({
      where: { id },
    });
  }

  async findByDate(date: Date): Promise<PointResponse> {
    // Converter a data fornecida para UTC
    const utcDate = new Date(date.toISOString());

    // Criar a data de início e fim do dia em UTC
    const startOfDay = new Date(utcDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(utcDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Consultar os pontos dentro do intervalo de tempo
    const points = await this.pointRepo.find({
      where: {
        time: Between(startOfDay, endOfDay),
      },
      order: {
        time: 'ASC',
      },
    });

    // Se não houver pontos, retornar null
    if (points.length === 0) {
      return null;
    }

    // Agrupar os pontos por usuário
    const pointsByUser: { [userId: string]: PointResponse } = {};
    let lastEntranceTime: Date | null = null;
    let lastExitTime: Date | null = null;

    points.forEach((point) => {
      if (!pointsByUser[point.userId]) {
        pointsByUser[point.userId] = {
          userId: point.userId,
          date: startOfDay.toISOString(),
          interval: '00:00:00',
          inWorking: '00:00:00',
          points: [],
        };
      }

      pointsByUser[point.userId].points.push({
        id: point.id,
        pointType: point.pointType,
        time: point.time.toISOString(),
      });

      if (point.pointType === 'entrance') {
        lastEntranceTime = new Date(point.time);
      }

      if (point.pointType === 'exit') {
        lastExitTime = new Date(point.time);
      }
    });

    // Calcular o inWorking usando a classe DateIntervalCalculator
    const inWorkingTime = lastEntranceTime
      ? DateIntervalCalculator.calculateInWorkingTime(points)
      : '00:00:00';

    // Calcular o intervalo usando a classe DateIntervalCalculator
    const intervalTime = DateIntervalCalculator.calculateIntervalTime(points);

    // Atribuir valores de inWorking e intervalo aos pontos
    Object.values(pointsByUser).forEach((userPoints) => {
      userPoints.inWorking = inWorkingTime;
      userPoints.interval = intervalTime;
    });

    // Retornar o primeiro objeto do array de valores de pointsByUser
    return Object.values(pointsByUser)[0];
  }

  update(id: string, updatePointDto: UpdatePointDto) {
    return this.pointRepo.update({ id }, updatePointDto);
  }

  remove(id: string) {
    return this.pointRepo.delete({ id });
  }
}
