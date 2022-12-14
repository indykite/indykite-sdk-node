import Bcrypt from './bcrypt';
import StandardScrypt from './standard_scrypt';
import Scrypt from './scrypt';
import HMACMD5 from './hmacmd5';
import HMACSHA1 from './hmacsha1';
import HMACSHA256 from './hmacsha256';
import HMACSHA512 from './hmacsha512';
import MD5 from './md5';
import PBKDF2_SHA256 from './pbkdf2_sha256';
import PBKDF_SHA1 from './pbkdf_sha1';
import SHA1 from './sha1';
import SHA256 from './sha256';
import SHA512 from './sha512';

class HashAlgorithmFactory {
  static createBcrypt(): Bcrypt {
    return new Bcrypt();
  }

  static createStandardScrypt(
    blockSize: string,
    derivedKeyLength: string,
    memoryCost: string,
    parallelization: string,
  ): StandardScrypt {
    return new StandardScrypt(blockSize, derivedKeyLength, memoryCost, parallelization);
  }

  static createScrypt(
    key: Buffer,
    saltSeparator: Buffer,
    rounds: string,
    memoryCost: string,
  ): Scrypt {
    return new Scrypt(key, saltSeparator, rounds, memoryCost);
  }

  static createHmacMd5(key: Buffer): HMACMD5 {
    return new HMACMD5(key);
  }

  static createHmacSha1(key: Buffer): HMACSHA1 {
    return new HMACSHA1(key);
  }

  static createHmacSha256(key: Buffer): HMACSHA256 {
    return new HMACSHA256(key);
  }

  static createHmacSha512(key: Buffer): HMACSHA512 {
    return new HMACSHA512(key);
  }

  static createMd5(rounds: string): MD5 {
    return new MD5(rounds);
  }

  static createPbkdf2Sha256(rounds: string): PBKDF2_SHA256 {
    return new PBKDF2_SHA256(rounds);
  }

  static createPbkdfSha1(rounds: string): PBKDF_SHA1 {
    return new PBKDF_SHA1(rounds);
  }

  static createSha1(rounds: string): SHA1 {
    return new SHA1(rounds);
  }

  static createSha256(rounds: string): SHA256 {
    return new SHA256(rounds);
  }

  static createSha512(rounds: string): SHA512 {
    return new SHA512(rounds);
  }
}

export default HashAlgorithmFactory;
