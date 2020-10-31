import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/user/infra/typeorm/entity/User';

@Entity('barbecue')
class Barbecue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column('date')
  date: Date;

  @Column()
  hour: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  mealPrice: number;

  @Column()
  drinksPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}

export default Barbecue;
