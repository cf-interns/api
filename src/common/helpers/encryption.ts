import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  scrypt,
  scryptSync,
} from "crypto";
import { promisify } from "util";
import { ENCRYPTION_ALGORITHM, IV, KEY } from "../constants";

@Injectable()
export class Encryption {
  private InFileIv;
  private InFileKey;
  private InFileHashKey;

  constructor(private readonly configService: ConfigService) {
    this.InFileIv = this.configService.get<string>("IV");
    this.InFileKey = this.configService.get<string>("KEY");
    this.InFileHashKey = this.configService.get<string>("HASH_KEY");
  }

  async encrypt(
    data: string,
    paramIv: Buffer,
    paramKey: string
  ): Promise<string> {
    try {
      if (data == null || data.length == 0) return;
      const iv = Buffer.concat([paramIv, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + paramKey;

      const formatedKey = (await promisify(scrypt)(key, "salt", 32)) as Buffer;
      const cipher = createCipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);

      const encryptedData =
        cipher.update(data, "utf-8", "hex") + cipher.final("hex");

      const authTag = cipher.getAuthTag().toString("hex");
      const metaAndEncoded = [authTag, encryptedData].join("@$");

      return metaAndEncoded;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("Encrypt Error: " + error.message);
    }
  }

  async decrypt(
    data: string,
    paramIv: Buffer,
    paramKey: string
  ): Promise<string> {
    try {
      if (data == null || data.length == 0) return;
      const iv = Buffer.concat([paramIv, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + paramKey;

      const [authTag, encrypted] = data.split("@$");

      const formatedKey = (await promisify(scrypt)(key, "salt", 32)) as Buffer;
      const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);
      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      const decryptedData =
        decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");

      return decryptedData;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("Decrypt Error: " + error.message);
    }
  }

  async encryptUniq(data: string): Promise<string> {
    try {
      if (data == null || data.length == 0) return;
      const iv = Buffer.concat([IV, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + KEY;

      const formatedKey = (await promisify(scrypt)(key, "salt", 32)) as Buffer;
      const cipher = createCipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);

      const encryptedData =
        cipher.update(data, "utf-8", "hex") + cipher.final("hex");

      const authTag = cipher.getAuthTag().toString("hex");
      const metaAndEncoded = [authTag, encryptedData].join("@$");

      return metaAndEncoded;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("EncryptUniq Error: " + error.message);
    }
  }

  async decryptUniq(data: string): Promise<string> {
    try {
      if (data == null || data.length == 0) return;
      const iv = Buffer.concat([IV, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + KEY;

      const [authTag, encrypted] = data.split("@$");

      const formatedKey = (await promisify(scrypt)(key, "salt", 32)) as Buffer;
      const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);
      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      const decryptedData =
        decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");

      return decryptedData;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("DecryptUniq Error : " + error.message);
    }
  }

  decryptUniqSync(data: string): string {
    try {
      if (data == null || data.length == 0) return "";
      const iv = Buffer.concat([IV, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + KEY;

      const [authTag, encrypted] = data.split("@$");

      const formatedKey = scryptSync(key, "salt", 32) as Buffer;
      const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);
      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      const decryptedData =
        decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");

      return decryptedData;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("DecryptUniq Error: " + error.message);
    }
  }

  encryptUniqSync(data: string): string {
    try {
      if (data == null || data.length == 0) return "";
      const iv = Buffer.concat([IV, Buffer.from(this.InFileIv, "utf-8")]);
      const key = this.InFileKey + "-" + KEY;

      const formatedKey = scryptSync(key, "salt", 32) as Buffer;
      const cipher = createCipheriv(ENCRYPTION_ALGORITHM, formatedKey, iv);

      const encryptedData =
        cipher.update(data, "utf-8", "hex") + cipher.final("hex");

      const authTag = cipher.getAuthTag().toString("hex");
      const metaAndEncoded = [authTag, encryptedData].join("@$");

      return metaAndEncoded;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("EncryptUniq Error: " + error.message);
    }
  }

  async hash(data: string) {
    try {
      if (data == null || data.length == 0) return;

      const salt = (await bcrypt.genSalt()) + this.InFileHashKey;

      const hash = await bcrypt.hash(data, salt);

      return hash;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("Hash Error : " + error.message);
    }
  }

  async compare(data: string, encrypted: string) {
    try {
      if (data == null || encrypted == null || data.length == 0) return;
      return await bcrypt.compare(data, encrypted);
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("Compare Error : " + error.message);
    }
  }

  signature(data: string, algorithm: string, secret: string) {
    try {
      const signed = createHmac(algorithm, secret).update(data);

      return signed;
    } catch (error: any) {
      console.log(JSON.stringify(error));
      throw new Error("Sign Error : " + error.message);
    }
  }
}
