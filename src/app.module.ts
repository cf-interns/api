import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import envConfig from "./config/env.config";
import { typeormConfig } from "./config/typeorm.config";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { AuthorizerMiddleware } from "./middlewares/authorizer.middleware";
import { CoreModule } from "./modules/core.module";

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), !ENV ? ".env" : `.env.${ENV}`),
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    CoreModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizerMiddleware)
      .exclude({ path: "docs", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
