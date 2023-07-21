import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";
import { SentryInterceptor } from "./interceptors/sentry.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("NestApplication");
  const port = configService.get<number>("app.port") ?? 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors();
  app.enableCors();
  app.setGlobalPrefix(configService.get<string>("app.prefix") ?? "api");

  if (configService.get<boolean>("app.isStagingOrProd")) {
    // setup production tools
    Sentry.init(configService.get("sentry.configuration"));
    app.useGlobalInterceptors(new SentryInterceptor());
  }

  await app.listen(port);

  logger.log(`Application listening at port ${port}`);
}

bootstrap();
