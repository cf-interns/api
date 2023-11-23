import { Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";
import {v4 as uuid} from 'uuid';
import { Application } from "./application.entity";
import { LocalDateTime } from "src/common/helpers/localDateTime";
import {DateTime} from 'luxon'

@Entity({ name: "Notifications" })
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  public _id: string;

  @Column({ nullable: true })
  public title?: string;

  @Column({ nullable: true })
  public body?: string;

  @Column({ nullable: true })
  public icon_url?: string;

  @ManyToOne(
    () => Application,
    (author: Application) => {
      author.notification
    }, {
      onDelete: 'CASCADE'
    }
  )
  public author?: Application;

  @Column()
  public recipient?: string;

  @Generated("uuid")
  public external_id: string;

  @CreateDateColumn()
  public created_at: Date;

  @Column()
  public status: string;

  /*   @Column({
    transformer: new EncryptionTransformer({
      key: process.env.TOKEN_ENCRYPTION_KEY,
      algorithm: "aes-256-ctr",
      ivLength: 32,
      iv: "7c5ea9d9fd378e376619ea357cbf50e1",
    }),
  }) */
  @Column()
  @Generated("uuid")
  token: string;

  @Column({ nullable: true })
  public provider?: string;

  @Column()
  public request_data: string;

  @Column({ nullable: true })
  public response_data: string;

  @Column()
  public sent_by: string;

  @Column({ nullable: true })
  public subject: string;

  @Column({ nullable: true })
  public notification_type: string;

  @Column({nullable: true})
  timeData: string;

  get messageTime(): LocalDateTime {
    const data = JSON.parse(this.timeData);
    return new LocalDateTime(DateTime.fromObject(data));
  }

  set messageTime(value: LocalDateTime) {
    this.timeData = JSON.stringify(value)
  }

  //we use getters and setters to facilitate the serialization and deserialization of LocalDateTime objects, storing them as JSON strings in the database. This approach ensures that we maintain a precise representation of date and time, catering to the local time context effectively.
}

export default Notification