import { Injectable } from '@nestjs/common';
import { InvalidTokenError } from './errors/invalid-token.error';
import { ConfigService } from '@/config/config.service';
import { compare, hash } from 'bcrypt';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'crypto';
import { AccessTokenData, RefreshTokenData } from './interfaces/token.interfaces';
import { EncryptedData } from './interfaces/encryption.interfaces';
import { ExpiredTokenError } from './errors/expired-token.error';
import { SessionResponseDto } from '@/app/session/interfaces/session.dto';
import { CreateHmacOptions } from './interfaces/hmac.interface';

interface IHashPasswordOptions {
  salts: number;
}

interface IGeneratePasswordOptions {
  length?: number;
  uppercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}

@Injectable()
export class SecurityService {
  private readonly algorithm = 'aes-256-cbc';
  constructor(private readonly config: ConfigService) {}

  generatePassword({
    length = 8,
    uppercase = true,
    numbers = true,
    symbols = true,
  }: IGeneratePasswordOptions): string {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const charsetUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsetNumbers = '0123456789';
    const charsetSymbols = '!@#$%&*()_+-=[]{}|;:,.<>?';

    let _charset = charset;
    let password = '';

    if (uppercase) {
      _charset += charsetUppercase;
      password += charsetUppercase.charAt(
        Math.floor(Math.random() * charsetUppercase.length),
      );
    }

    if (numbers) {
      _charset += charsetNumbers;
      password += charsetNumbers.charAt(
        Math.floor(Math.random() * charsetNumbers.length),
      );
    }

    if (symbols) {
      _charset += charsetSymbols;
      password += charsetSymbols.charAt(
        Math.floor(Math.random() * charsetSymbols.length),
      );
    }

    while (password.length < length) {
      password += _charset.charAt(Math.floor(Math.random() * _charset.length));
    }

    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }

  async hashPassword(password: string, options?: IHashPasswordOptions): Promise<string> {
    return hash(password, options?.salts ?? 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  isHash(str: string) {
    const _r = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;
    return _r.test(str);
  }

  async generateAccessToken(user: SessionResponseDto['user']) {
    const accessToken = sign({ user }, this.config.JWT_SECRET, {
      expiresIn: this.config.JWT_EXPIRATION_TIME,
      subject: user.id,
    });

    const decoded = await this.decodeToken(accessToken);
    const expiresAt = new Date(decoded.exp * 1000);

    return { accessToken, expiresAt };
  }

  async generateRefreshToken(accessToken: string) {
    const accessData = await this.decodeToken(accessToken);

    const refreshToken = sign({}, this.config.JWT_REFRESH_SECRET, {
      expiresIn: this.config.JWT_REFRESH_EXPIRATION_TIME,
      subject: accessData.sub,
    });

    const decoded = await this.decodeRefreshToken(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    return { refreshToken, expiresAt };
  }

  async decodeToken(token: string): Promise<AccessTokenData> {
    try {
      const data = verify(token, this.config.JWT_SECRET);
      return data as AccessTokenData;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError('Token expired');
      }

      throw new InvalidTokenError('Invalid token');
    }
  }

  async decodeRefreshToken(token: string): Promise<RefreshTokenData> {
    try {
      const data = verify(token, this.config.JWT_REFRESH_SECRET);
      return data as RefreshTokenData;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError('Token expired');
      }

      throw new InvalidTokenError('Invalid token');
    }
  }

  encrypt(text: string): EncryptedData {
    const encrypted = {
      iv: randomBytes(16),
      content: '',
    };

    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(this.config.ENCRYPTION_SECRET, 'hex'),
      encrypted.iv,
    );

    encrypted.content = cipher.update(text, 'utf-8', 'hex');
    encrypted.content += cipher.final('hex');

    return {
      iv: encrypted.iv.toString('hex'),
      content: encrypted.content,
    };
  }

  decrypt({ iv, content }: EncryptedData): string {
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(this.config.ENCRYPTION_SECRET, 'hex'),
      Buffer.from(iv, 'hex'),
    );

    let data = decipher.update(content, 'hex', 'utf-8');
    data += decipher.final('utf-8');
    return data;
  }

  createSecretKey(encoding: BufferEncoding = 'base64'): string {
    return randomBytes(32).toString(encoding);
  }

  createHmac(
    text: string,
    { encoding = 'base64', algorithm = 'sha256', secretKey }: CreateHmacOptions,
  ): string {
    return createHmac(algorithm, secretKey).update(text).digest(encoding);
  }
}
