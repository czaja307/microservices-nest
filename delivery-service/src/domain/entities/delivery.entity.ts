import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DeliveryStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  FAILED = 'Failed',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar', length: 255 })
  deliveryAddress: string;

  @Column({ type: 'varchar', length: 20 })
  recipientPhone: string;

  @Column({ type: 'varchar', length: 255 })
  recipientName: string;

  @Column({ type: 'varchar', length: 50, default: DeliveryStatus.PENDING })
  status: string;

  @Column({ type: 'int', nullable: true })
  estimatedDeliveryMinutes: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deliveryPersonId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
