import * as path from "path";
import { EventEnum } from "src/common/enums/type-of-event.enum";

const ENV = process.env.NODE_ENV;

require("dotenv").config({
  path: path.resolve(process.cwd(), !ENV ? ".env" : `.env.${ENV}`),
});

export const rabbit = {
  exchange: process.env.RABBIT_EXCHANGE_NAME,
  uri: process.env.RABBIT_URI,
  durable: process.env.RABBIT_DURABLE,
};

export const QueueConfig = {
  create_callback: {
    exchange: process.env.RABBITMQ_EXCHANGE_NAME,
    routingKey: EventEnum.create_callback,
    queue: "rhola-update-transaction-status",
    queueOptions: {
      durable: true,
      autoDelete: false,
    },
  },
};
