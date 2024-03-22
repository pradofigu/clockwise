import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Point {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pointType: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(0)' })
  time: Date;

  @Column()
  userId: string;
}
