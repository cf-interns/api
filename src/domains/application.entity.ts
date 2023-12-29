import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

import Notification from "./notifications.entity";
import { Email } from "./email.entity";

@Entity()
export class Application {
  @PrimaryGeneratedColumn("rowid") //Cannot use uuid because of foreign key constraints with Notification Entity
  public _id: string;

  @Column()
  public appName: string;

  @Column({ nullable: true })
  public status: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  public description: string;

  @Column()
  @Generated("uuid")
  public token: string;

  @ManyToOne(() => User, (author: User) => author.apps, {
    onDelete: 'CASCADE'
  })
  public author: User;

  @OneToMany(
    () => Notification,
    (notification: Notification) => {
      notification.author;
    }
  )
  public notification: Notification[];


  @Column()
  @Generated('uuid')
  api_key: string;

  // @OneToMany(() => Push, (push: Push) => push.author)
  // push?: Push[];

  @OneToMany(() => Email, (email: Email) => email.author)
  email?: Email[];

  // @OneToMany(() => Sms, (sms: Sms) => sms.author)
  // sms?: Sms[];
}
