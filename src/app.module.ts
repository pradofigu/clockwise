import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointModule } from './clockwise/point.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './clockwise/entities/point.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'points',
      entities: [Point],
      timezone: 'America/Sao_Paulo',
      synchronize: true,
      logging: true,
    }),
    PointModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
