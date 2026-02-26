import { BinaryToTextEncoding } from 'crypto';

export interface CreateHmacOptions {
  encoding: BinaryToTextEncoding;
  algorithm: string;
  secretKey: string;
}
