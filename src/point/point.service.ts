import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Between, Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PointResponse } from './interface/point.interface';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepo: Repository<Point>,
  ) {}

  create(createPointDto: CreatePointDto) {
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

  async findByDate(date: Date): Promise<PointResponse[]> {
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

    // Agrupar os pontos por usuário
    const pointsByUser: { [userId: string]: PointResponse } = {};
    let totalInterval = 0;
    let inWorkingTime = 0;
    let lastEntranceTime: Date | null = null;

    points.forEach((point, index) => {
      if (!pointsByUser[point.user_id]) {
        pointsByUser[point.user_id] = {
          user_id: point.user_id,
          date: startOfDay.toISOString(),
          interval: '',
          in_working: '',
          points: [],
        };
      }
      pointsByUser[point.user_id].points.push({
        id: point.id,
        point_type: point.point_type,
        time: point.time.toISOString(),
      });

      // Calcular intervalo entre "exit" e "entrance"
      if (index > 0 && point.point_type === 'exit') {
        const exitTime = new Date(point.time);
        const entranceTime = new Date(points[index - 1].time);
        totalInterval += exitTime.getTime() - entranceTime.getTime();
      }

      // Calcular tempo "in_working"
      if (point.point_type === 'entrance') {
        if (lastEntranceTime) {
          const entranceTime = new Date(point.time);
          inWorkingTime += entranceTime.getTime() - lastEntranceTime.getTime();
        }
        lastEntranceTime = new Date(point.time);
      }
    });

    // Se o último ponto for um "exit", calcular o tempo "in_working" até o momento atual
    if (points.length > 0 && points[points.length - 1].point_type === 'exit') {
      const lastExitTime = new Date(points[points.length - 1].time);
      inWorkingTime += new Date().getTime() - lastExitTime.getTime();
    }

    // Calcular intervalo total de milissegundos para horas, minutos e segundos
    const intervalHours = Math.floor(totalInterval / 3600000);
    const intervalMinutes = Math.floor((totalInterval % 3600000) / 60000);
    const intervalSeconds = Math.floor((totalInterval % 60000) / 1000);

    // Converter tempo "in_working" total de milissegundos para horas, minutos e segundos
    const inWorkingHours = Math.floor(inWorkingTime / 3600000);
    const inWorkingMinutes = Math.floor((inWorkingTime % 3600000) / 60000);
    const inWorkingSeconds = Math.floor((inWorkingTime % 60000) / 1000);

    // Atribuir valores aos pontos
    Object.values(pointsByUser).forEach((userPoints) => {
      userPoints.interval = `${intervalHours.toString().padStart(2, '0')}:${intervalMinutes.toString().padStart(2, '0')}:${intervalSeconds.toString().padStart(2, '0')}`;
      userPoints.in_working = `${inWorkingHours.toString().padStart(2, '0')}:${inWorkingMinutes.toString().padStart(2, '0')}:${inWorkingSeconds.toString().padStart(2, '0')}`;
    });

    return Object.values(pointsByUser);
  }

  update(id: string, updatePointDto: UpdatePointDto) {
    return this.pointRepo.update({ id }, updatePointDto);
  }

  remove(id: string) {
    return this.pointRepo.delete({ id });
  }
}
