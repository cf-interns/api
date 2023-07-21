/* eslint-disable @typescript-eslint/ban-types */
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const resData = data['data'];

        let res;

        if (resData.items) {
          res = {
            data: {
              items: resData.items.map((i) => {
                return plainToInstance(this.dto, i, {
                  excludeExtraneousValues: true,
                });
              }),
              meta: resData.meta,
              links: resData.links,
            },
          };
        } else {
          res = {
            data: plainToInstance(this.dto, resData, {
              excludeExtraneousValues: true,
            }),
          };
        }

        return { ...res, code: data['code'], message: data['message'] };
      }),
    );
  }
}
