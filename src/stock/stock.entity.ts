import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from '../product/product.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column('int')
  quantity: number; // Quantité en stock
}
