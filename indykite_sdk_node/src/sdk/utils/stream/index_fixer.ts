export interface OutputModifier {
  onClientClosed: () => Promise<void>;
  onData: (data: unknown, next: (modifiedData: unknown) => void) => Promise<void>;
}

class IndexFixer<T extends string> implements OutputModifier {
  private startIndex = 0;
  private nextIndex = 0;

  constructor(private indexPropName: T) {}

  async onClientClosed(): Promise<void> {
    this.startIndex = this.nextIndex;
  }

  async onData(data: unknown, next: (modifiedData: unknown) => void): Promise<void> {
    const fixedData = await this.processData(data, this.indexPropName);
    next(fixedData);
  }

  private async processData(data: unknown, path: string): Promise<unknown> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map((datum) => this.processData(datum, path)));
    }

    if (path.includes('.') && typeof data === 'object' && data !== null) {
      const execResult = /^([^.]*)\.(.*)$/.exec(path);
      if (execResult) {
        const topPropertyName = execResult[1];
        const restPropertyPath = execResult[2];
        const processedProperty = await this.processData(
          (data as Record<string, unknown>)[topPropertyName],
          restPropertyPath,
        );
        return {
          ...data,
          [topPropertyName]: processedProperty,
        };
      }
    }

    const hasIndexProp = (data: unknown): data is Record<string, unknown> => {
      return typeof data === 'object' && data !== null && path in data;
    };

    if (hasIndexProp(data) && ['string', 'number'].includes(typeof data[path])) {
      const isIndexString = typeof data[path] === 'string';
      const parsedIndex: number = isIndexString
        ? Number.parseInt(data[path] as string)
        : (data[path] as number);
      data[path] = parsedIndex + this.startIndex;
      const newNextIndex = (data[path] as number) + 1;
      if (newNextIndex > this.nextIndex) {
        this.nextIndex = newNextIndex;
      }
      if (isIndexString) {
        data[path] = (data[path] as number).toString();
      }
    }

    return data;
  }
}

export default IndexFixer;
