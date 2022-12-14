import Bcrypt from '../bcrypt';
import HashAlgorithm from '../hash_algorithm';
import HashAlgorithmFactory from '../hash_algorithm_factory';
import HMACMD5 from '../hmacmd5';
import HMACSHA1 from '../hmacsha1';
import HMACSHA256 from '../hmacsha256';
import HMACSHA512 from '../hmacsha512';
import MD5 from '../md5';
import PBKDF2SHA256 from '../pbkdf2_sha256';
import PBKDFSHA1 from '../pbkdf_sha1';
import Scrypt from '../scrypt';
import SHA1 from '../sha1';
import SHA256 from '../sha256';
import SHA512 from '../sha512';
import StandardScrypt from '../standard_scrypt';

let instance: HashAlgorithm;

describe('when the "bcrypt" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createBcrypt();
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(Bcrypt);
    expect(instance.type).toBe('bcrypt');
  });
});

describe('when the "standard scrypt" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createStandardScrypt(
      'block-size',
      'derived-key-length',
      'memory-cost',
      'parallelization',
    );
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(StandardScrypt);
    expect(instance.type).toBe('standardScrypt');
    if (instance instanceof StandardScrypt) {
      expect(instance.blockSize).toBe('block-size');
      expect(instance.derivedKeyLength).toBe('derived-key-length');
      expect(instance.memoryCost).toBe('memory-cost');
      expect(instance.parallelization).toBe('parallelization');
    }
  });
});

describe('when the "scrypt" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createScrypt(
      Buffer.from('key'),
      Buffer.from('salt-separator'),
      'rounds',
      'memory-cost',
    );
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(Scrypt);
    expect(instance.type).toBe('scrypt');
    if (instance instanceof Scrypt) {
      expect(instance.key.toString()).toBe('key');
      expect(instance.memoryCost).toBe('memory-cost');
      expect(instance.rounds).toBe('rounds');
      expect(instance.saltSeparator.toString()).toBe('salt-separator');
    }
  });
});

describe('when the "HMACMD5" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createHmacMd5(Buffer.from('key'));
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(HMACMD5);
    expect(instance.type).toBe('hmacMd5');
    expect(instance instanceof HMACMD5 && instance.key.toString()).toBe('key');
  });
});

describe('when the "HMACSHA1" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createHmacSha1(Buffer.from('key'));
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(HMACSHA1);
    expect(instance.type).toBe('hmacSha1');
    expect(instance instanceof HMACSHA1 && instance.key.toString()).toBe('key');
  });
});

describe('when the "HMACSHA256" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createHmacSha256(Buffer.from('key'));
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(HMACSHA256);
    expect(instance.type).toBe('hmacSha256');
    expect(instance instanceof HMACSHA256 && instance.key.toString()).toBe('key');
  });
});

describe('when the "HMACSHA512" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createHmacSha512(Buffer.from('key'));
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(HMACSHA512);
    expect(instance.type).toBe('hmacSha512');
    expect(instance instanceof HMACSHA512 && instance.key.toString()).toBe('key');
  });
});

describe('when the "MD5" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createMd5('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(MD5);
    expect(instance.type).toBe('md5');
    expect(instance instanceof MD5 && instance.key).toBe('key');
  });
});

describe('when the "PBKDF2SHA256" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createPbkdf2Sha256('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(PBKDF2SHA256);
    expect(instance.type).toBe('pbkdf2Sha256');
    expect(instance instanceof PBKDF2SHA256 && instance.key).toBe('key');
  });
});

describe('when the "PBKDFSHA1" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createPbkdfSha1('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(PBKDFSHA1);
    expect(instance.type).toBe('pbkdfSha1');
    expect(instance instanceof PBKDFSHA1 && instance.key).toBe('key');
  });
});

describe('when the "SHA1" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createSha1('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(SHA1);
    expect(instance.type).toBe('sha1');
    expect(instance instanceof SHA1 && instance.key).toBe('key');
  });
});

describe('when the "SHA256" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createSha256('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(SHA256);
    expect(instance.type).toBe('sha256');
    expect(instance instanceof SHA256 && instance.key).toBe('key');
  });
});

describe('when the "SHA512" instance is created', () => {
  beforeEach(() => {
    instance = HashAlgorithmFactory.createSha512('key');
  });

  it('creates the correct instance', () => {
    expect(instance).toBeInstanceOf(SHA512);
    expect(instance.type).toBe('sha512');
    expect(instance instanceof SHA512 && instance.key).toBe('key');
  });
});
