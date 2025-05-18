import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string; // Links the payment to an order

  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string; // Example: "Credit Card", "PayPal", "Bank Transfer"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number; // Total amount paid

  @Column({ type: 'varchar', length: 50 })
  paymentStatus: string; // Example: "Paid", "Pending", "Failed"

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
