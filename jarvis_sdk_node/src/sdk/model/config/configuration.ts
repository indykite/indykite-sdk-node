export class NodeConfiguration {
  displayName?: string;
  description?: string;
  etag?: string;
  id?: string;
  createTime?: Date;
  updateTime?: Date;
  customerId?: string;
  appSpaceId?: string;
  tenantId?: string;

  constructor(public name: string) {}
}
