import { BadRequestException, ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";
import { SentryInterceptor } from "./interceptors/sentry.interceptor";
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ApplicationModule } from "./modules/application/application.module";
import SmsModule from "./modules/sms/sms.module";
import { EmailModule } from "./modules/email/email.module";
import {initializeApp, applicationDefault} from 'firebase-admin/app';
import PushNotificationsModule from "./modules/pushNotifications/pushnotification.module";
import { NotifcationsModule } from "./modules/notifications/notifications.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    credentials: true
  }

  
initializeApp({
  credential: applicationDefault(),
  projectId: "gns-cf"
})


  const configService = app.get(ConfigService);
  const logger = new Logger("GNS APP");
  const port = configService.get<number>("app.port") ?? 3000;


  app.useGlobalInterceptors();
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true

    }
  ));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  app.use(cookieParser());
  app.enableCors(corsOptions);
  app.setGlobalPrefix(configService.get<string>("app.prefix") ?? "api");


  if (configService.get<boolean>("app.isStagingOrProd")) {
    // setup production tools
    Sentry.init(configService.get("sentry.configuration"));
    app.useGlobalInterceptors(new SentryInterceptor());
  }
  const config = new DocumentBuilder()
    .setTitle('GNS')
    .setDescription('### GNS API Overview')
    .setVersion('1.0')
    .addTag('docs')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [UserModule, AuthModule, ApplicationModule, NotifcationsModule]
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(port);

  logger.log(`Application listening at port ${port}`);
}

bootstrap();
