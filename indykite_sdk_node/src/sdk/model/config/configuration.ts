/**
 * Docs: https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ConfigNode
 */
export class NodeConfiguration {
  // Globally unique identifier.
  id?: string;
  // Name is unique name of configuration object.
  // name?: string;
  // Human readable name of configuration.
  displayName?: string;
  // Description of the configuration.
  description?: string;
  // Output only. The time at which the configuration was created.
  createTime?: Date;
  // Output only. The time at which the configuration was last changed.
  // This value is initially set to the `create_time` then increases monotonically with each change.
  updateTime?: Date;
  // Output only. The user/service id who created the configuration.
  createdBy?: string;
  // Output only. The user/service id who last changed the configuration.
  updatedBy?: string;
  // Output only. The time this configuration was destroyed.
  // Only present if deletion of object was requested.
  destroy_time?: Date;
  // Output only. The time this configuration will be entirely deleted.
  // Only present if deletion of object was requested.
  delete_time?: Date;
  // Output only. Multiversion concurrency control version.
  etag?: string;
  // CustomerId this object is directly or indirectly connected to.
  customerId?: string;
  // AppSpaceId this object is directly or indirectly connected to.
  appSpaceId?: string;

  constructor(public name: string) {}
}
