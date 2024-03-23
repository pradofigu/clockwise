import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ClockType {
  CLOCK_IN = 'Clock In',
  CLOCK_OUT = 'Clock Out',
}

@Entity()
export class ClockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ClockType,
    default: ClockType.CLOCK_IN,
  })
  clockType: ClockType;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(0)' })
  time: Date;

  @Column()
  userId: string;
}
