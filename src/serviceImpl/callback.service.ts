import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEnum } from "src/common/enums/type-of-event.enum";
import { ProducerService } from "src/common/rabbitmq/producer.rabbit";
import { Callback } from "src/domains/callback.entity";
import { CallbackServiceInterface } from "src/services/callback.interface";
import { Repository } from "typeorm";

@Injectable()
export class CallbackService implements CallbackServiceInterface {
  constructor(
    @InjectRepository(Callback)
    private callbackRepository: Repository<Callback>,
    private producer: ProducerService
  ) {}

  async createCallback(body: any): Promise<any> {
    this.callbackRepository.save(body);
  }

  async updateCallback(body: any): Promise<any> {
    const payload = await this.extractStatus(body);

    const callback = await this.callbackRepository.findOneBy({
      transaction_id: payload.transaction_id,
    });

    if (!callback) return;

    const updated = await this.callbackRepository.update(
      payload.transaction_id,
      {
        transaction_status: payload.status,
        provider_transaction_id: payload.provider_transaction_id,
      }
    );

    if (updated.affected > 0) {
      this.producer.processAsyncExecution(payload, EventEnum.update_callback);
    }

    return payload;
  }

  private async extractStatus(body: any) {
    const eventType = body.event.type ?? "None";
    let transaction_id, status, provider_transaction_id;

    switch (eventType) {
      case "BVN":
        transaction_id = body.data.reference;
        status = body.data.status;
        provider_transaction_id = body.data.id;
        break;
      case "Transfer":
        transaction_id = body.data.reference;
        status = body.data.complete_message;
        provider_transaction_id = body.data.id;
        break;
      case "None":
        if (body.data.tx_ref && body.data.status && body.data.id) {
          transaction_id = body.data.tx_ref;
          status = body.data.status;
          provider_transaction_id = body.data.id;
        }

        break;
      default:
        break;
    }

    return { transaction_id, status, provider_transaction_id };
  }
}
