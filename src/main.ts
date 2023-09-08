import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";
import { SentryInterceptor } from "./interceptors/sentry.interceptor";
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  const configService = app.get(ConfigService);
  const logger = new Logger("NestApplication");
  const port = configService.get<number>("app.port") ?? 3000;


 // app.useGlobalInterceptors();
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      exceptionFactory:(errors)=> {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true
      
    }
  ));

  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix(configService.get<string>("app.prefix") ?? "api");


  if (configService.get<boolean>("app.isStagingOrProd")) {
    // setup production tools
    Sentry.init(configService.get("sentry.configuration"));
    app.useGlobalInterceptors(new SentryInterceptor());
  }
  const config = new DocumentBuilder()
  .setTitle('GNS Backend')
  .setDescription('Backend for GNS')
  .setVersion('1.0')
  .addTag('doc')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(port);

  logger.log(`Application listening at port ${port}`);
}

bootstrap();
