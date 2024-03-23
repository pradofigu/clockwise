import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClockModule } from './clockwise/clock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockEntity } from './clockwise/persistence/entities/clock.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'app-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'clockwise',
      entities: [ClockEntity],
      synchronize: true,
      logging: true,
    }),
    ClockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
