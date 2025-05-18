// meal-service/src/domain/entities/order-preparation.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PreparationStatus {
  RECEIVED = 'Received',
  IN_PROGRESS = 'In Progress',
  READY = 'Ready',
  DELIVERED = 'Delivered',
}

@Entity('order_preparation')
export class OrderPreparation {
  @PrimaryColumn({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'simple-array' })
  mealIds: string[];

  @Column({ type: 'varchar', length: 50, default: PreparationStatus.RECEIVED })
  status: string;

  @Column({ type: 'int', nullable: true })
  estimatedCompletionMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
