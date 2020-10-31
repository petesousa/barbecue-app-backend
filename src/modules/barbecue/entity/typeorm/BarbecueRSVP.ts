import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import User from '@modules/user/entity/typeorm/User';
import Barbecue from './Barbecue';

@Entity('barbecue_rsvp')
class BarbecueRSVP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToMany(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  barbecueId: string;

  @ManyToMany(() => Barbecue)
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
