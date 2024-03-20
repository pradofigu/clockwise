import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointModule } from './point/point.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './point/entities/point.entity';

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
      synchronize: true,
      logging: true,
    }),
    PointModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
