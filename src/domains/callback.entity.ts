import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "callback" })
export class Callback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  transaction_id: string;

  @Column({ nullable: false })
  transaction_status: string;

  @Column({ nullable: true })
  provider_transaction_id: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  amount: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
