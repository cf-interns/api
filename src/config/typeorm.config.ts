import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    type: "postgres",
    host: configService.get<string>("database.host"),
    port: configService.get<number>("database.port"),
    username: configService.get<string>("database.username"),
    password: configService.get<string>("database.password"),
    database: configService.get<string>("database.name"),
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: true,
    migrations: ["src/migrations/*{.ts,.js}"],
    cli: {
      migrationsDir: "src/migration",
    },
    extra: {
      trustServerCertificate: true,
    },
  }),
  inject: [ConfigService],
};
