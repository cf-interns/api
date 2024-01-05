import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt'
import { RegisterDataDto } from "src/dtos/reister.dto";
import PostgresErrorCode from "src/enums/postgresErrorCode.enum";
import { User } from "../domains/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "../services/tokenPayload.interface";


@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async register(registerData: RegisterDataDto): Promise<object> {
    try {
      const hashPassword = await bcrypt.hash(registerData.password, 10);
      await this.userService.createUser({
        ...registerData,
        password: hashPassword,
      });
      this.logger.log(`Registering user ${JSON.stringify(registerData)}`);
      // console.log('User Created!');
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
      this.logger.log(
        "An error occured while registering a new user",
        error.stack
      );
    }

    return { mesaage: "User Created!" };
  }

  public async loginUser(email: string, password: string): Promise<User> {
    try {
      const getUser = await this.userService.getByEmail(email);
      await this.verifyThisUsersPassword(password, getUser.password);
      return getUser;
    } catch (error) {
      this.logger.log(`An error occured while login in a user`, error.stack);
      throw new HttpException("Invalid login", HttpStatus.BAD_REQUEST);
    }
  }

  public async verifyThisUsersPassword(password: string, passwordInDb: string) {
    const bcryptVerify = await bcrypt.compare(password, passwordInDb);
    if (!bcryptVerify) {
      throw new HttpException("Invalid login", HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithToken(userId: string) {
    try {
      const payload: TokenPayload = { userId };
      const acess_token: any = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_ACCESSS_TOKEN_SECRET"),
        expiresIn: `${this.configService.get(
          "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
        )}s`,
      });
      return `Auth = ${acess_token}; HttpOnly; Path=/; Max-Age${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}`;
    } catch (error) {
      this.logger.log(`An error occured while getting cookie`, error.stack);
      throw new InternalServerErrorException("Internal Error");
    }
  }

  public getCookieWithRefreshToken(userId: string) {
    try {
      const payload: TokenPayload = { userId };
      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get("jwt.refresh"),
        expiresIn: `${this.configService.get("jwt.refreshExpTime")}s`,
      });
      const cookie = `Refresh=${refresh_token};  HttpOnly; Path=/; Max-Age${this.configService.get(
        "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
      )}`;
      //TODO: Fiddle with path param to prevent the browser from sending the refresh_token on every req

      return {
        cookie,
        refresh_token,
      };
    } catch (error) {
      this.logger.log(`An error occured while getting refreshToken`);
      throw new InternalServerErrorException("Internal Error");
    }
  }

  public removeCookieForLogOut() {
    return [
      `Auth=; HttpOnly; Path=/; Max-Age=0`,
      "Refresh=; HttpOnly; Path=/; Max-Age=0",
    ];
  }

  private apiKeys: string[] = [
    "api-key-1",
    "api-key-2",
    "api-key-3",
    "api-key-4",
    "api-key-5",
    "api-key-6",
  ];
  public validateApiKey(apiKey: string) {
    return this.apiKeys.find(apiK => apiKey === apiK);
  }
}


