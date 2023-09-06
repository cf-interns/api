import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import envConfig from "./config/env.config";
import { typeormConfig } from "./config/typeorm.config";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { AuthorizerMiddleware } from "./middlewares/authorizer.middleware";
import { CoreModule } from "./modules/core.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import * as Joi from "joi";

const ENV = process.env.NODE_ENV;
console.log(ENV, '<====== ENV', process.cwd());

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
      envFilePath:  path.resolve(process.cwd(), !ENV ? ".env" : `.env.${ENV}`)  /* '.env.dev' */,
      cache: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string(),
        JWT_EXPIRATION_TIME: Joi.string(),
      })
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    CoreModule,
    UserModule,
    AuthModule,
   
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
