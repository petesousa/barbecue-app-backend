import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import User from '@modules/user/entity/typeorm/User';
import Barbecue from './Barbecue';

@Entity('barbecue_rsvp')
class BarbecueRSVP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  barbecueId: string;

  @ManyToOne(() => Barbecue)
  @JoinColumn({ name: 'barbecueId' })
  barbecue: Barbecue;

  @Column()
  rsvp: boolean;

  @Column()
  willEat: boolean;

  @Column()
  willDrink: boolean;

  @Column()
  hasPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}

export default BarbecueRSVP;
