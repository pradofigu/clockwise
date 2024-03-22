import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClockModule } from './clockwise/clock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clockwise } from './clockwise/persistence/entities/clockwise.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'clockwise',
      entities: [Clockwise],
      timezone: 'America/Sao_Paulo',
      synchronize: true,
      logging: true,
    }),
    ClockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
