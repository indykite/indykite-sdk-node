import IndexFixer from '../index_fixer';

const onDataResolver = <T extends string>(indexFixer: IndexFixer<T>, data: unknown) => {
  return new Promise((resolve) => {
    indexFixer.onData(data, (returnedValue: unknown) => {
      resolve(returnedValue);
    });
  });
};

describe('when data is not an object', () => {
  let indexFixer: IndexFixer<'prop'>;

  beforeEach(() => {
    indexFixer = new IndexFixer('prop');
  });

  it('returns the original value', () => {
    expect(onDataResolver(indexFixer, null)).resolves.toBe(null);
    expect(onDataResolver(indexFixer, 'abc')).resolves.toBe('abc');
    expect(onDataResolver(indexFixer, 42)).resolves.toBe(42);
    expect(onDataResolver(indexFixer, true)).resolves.toBe(true);
  });
});

describe('when data does not contain required property', () => {
  let indexFixer: IndexFixer<'prop'>;

  beforeEach(() => {
    indexFixer = new IndexFixer('prop');
  });

  it('returns the original value', () => {
    expect(onDataResolver(indexFixer, { key: 'value' })).resolves.toEqual({ key: 'value' });
  });
});

describe('when data contains required property', () => {
  let indexFixer: IndexFixer<'prop'>;

  beforeEach(() => {
    indexFixer = new IndexFixer('prop');
  });

  describe('when the index is a string', () => {
    it('returns the original value', () => {
      expect(onDataResolver(indexFixer, { prop: '0' })).resolves.toEqual({ prop: '0' });
      expect(onDataResolver(indexFixer, { prop: '1' })).resolves.toEqual({ prop: '1' });
      expect(onDataResolver(indexFixer, { prop: '2' })).resolves.toEqual({ prop: '2' });
    });

    describe('when the client is closed after some records', () => {
      beforeEach(async () => {
        await onDataResolver(indexFixer, { prop: '0' });
        await onDataResolver(indexFixer, { prop: '2' });
        await onDataResolver(indexFixer, { prop: '1' });
        await indexFixer.onClientClosed();
      });

      it('returns shifted values', () => {
        expect(onDataResolver(indexFixer, { prop: '0' })).resolves.toEqual({ prop: '3' });
        expect(onDataResolver(indexFixer, { prop: '1' })).resolves.toEqual({ prop: '4' });
        expect(onDataResolver(indexFixer, { prop: '2' })).resolves.toEqual({ prop: '5' });
      });
    });
  });

  describe('when the index is a number', () => {
    it('returns the original value', () => {
      expect(onDataResolver(indexFixer, { prop: 0 })).resolves.toEqual({ prop: 0 });
      expect(onDataResolver(indexFixer, { prop: 1 })).resolves.toEqual({ prop: 1 });
      expect(onDataResolver(indexFixer, { prop: 2 })).resolves.toEqual({ prop: 2 });
    });

    describe('when the client is closed after some records', () => {
      beforeEach(async () => {
        await onDataResolver(indexFixer, { prop: 0 });
        await onDataResolver(indexFixer, { prop: 1 });
        await onDataResolver(indexFixer, { prop: 2 });
        await indexFixer.onClientClosed();
      });

      it('returns shifted values', () => {
        expect(onDataResolver(indexFixer, { prop: 0 })).resolves.toEqual({ prop: 3 });
        expect(onDataResolver(indexFixer, { prop: 1 })).resolves.toEqual({ prop: 4 });
        expect(onDataResolver(indexFixer, { prop: 2 })).resolves.toEqual({ prop: 5 });
      });
    });
  });
});

describe('when data is an array of objects containing the required property', () => {
  let indexFixer: IndexFixer<'prop'>;

  beforeEach(() => {
    indexFixer = new IndexFixer('prop');
  });

  it('returns the original value', () => {
    expect(onDataResolver(indexFixer, [{ prop: 0 }, { prop: 1 }, { prop: 2 }])).resolves.toEqual([
      { prop: 0 },
      { prop: 1 },
      { prop: 2 },
    ]);
  });

  describe('when the client is closed after some records', () => {
    beforeEach(async () => {
      await onDataResolver(indexFixer, [{ prop: 1 }, { prop: 0 }, { prop: 2 }]);
      await indexFixer.onClientClosed();
    });

    it('returns shifted values', () => {
      expect(onDataResolver(indexFixer, [{ prop: 0 }, { prop: 1 }, { prop: 2 }])).resolves.toEqual([
        { prop: 3 },
        { prop: 4 },
        { prop: 5 },
      ]);
    });
  });
});

describe('when data is an object containing a subobject with the required property', () => {
  let indexFixer: IndexFixer<'prop.index'>;

  beforeEach(() => {
    indexFixer = new IndexFixer('prop.index');
  });

  it('returns the original value', () => {
    expect(onDataResolver(indexFixer, { prop: { index: '0' } })).resolves.toEqual({
      prop: { index: '0' },
    });
    expect(onDataResolver(indexFixer, { prop: { index: '1' } })).resolves.toEqual({
      prop: { index: '1' },
    });
    expect(onDataResolver(indexFixer, { prop: { index: '2' } })).resolves.toEqual({
      prop: { index: '2' },
    });
  });

  describe('when the client is closed after some records', () => {
    beforeEach(async () => {
      await onDataResolver(indexFixer, { prop: { index: '0' } });
      await onDataResolver(indexFixer, { prop: { index: '2' } });
      await onDataResolver(indexFixer, { prop: { index: '1' } });
      await indexFixer.onClientClosed();
    });

    it('returns shifted values', () => {
      expect(onDataResolver(indexFixer, { prop: { index: '0' } })).resolves.toEqual({
        prop: { index: '3' },
      });
      expect(onDataResolver(indexFixer, { prop: { index: '1' } })).resolves.toEqual({
        prop: { index: '4' },
      });
      expect(onDataResolver(indexFixer, { prop: { index: '2' } })).resolves.toEqual({
        prop: { index: '5' },
      });
    });
  });
});
