// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/ingest/v1beta3/ingest_api.proto" (package "indykite.ingest.v1beta3", syntax proto3)
// tslint:disable
//
// Copyright (c) 2023 IndyKite
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import { IngestAPI } from "./ingest_api";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { BatchDeleteRelationshipPropertiesResponse } from "./ingest_api";
import type { BatchDeleteRelationshipPropertiesRequest } from "./ingest_api";
import type { BatchDeleteNodePropertiesResponse } from "./ingest_api";
import type { BatchDeleteNodePropertiesRequest } from "./ingest_api";
import type { BatchDeleteRelationshipsResponse } from "./ingest_api";
import type { BatchDeleteRelationshipsRequest } from "./ingest_api";
import type { BatchDeleteNodesResponse } from "./ingest_api";
import type { BatchDeleteNodesRequest } from "./ingest_api";
import type { BatchUpsertRelationshipsResponse } from "./ingest_api";
import type { BatchUpsertRelationshipsRequest } from "./ingest_api";
import type { BatchUpsertNodesResponse } from "./ingest_api";
import type { BatchUpsertNodesRequest } from "./ingest_api";
import type { IngestRecordResponse } from "./ingest_api";
import type { IngestRecordRequest } from "./ingest_api";
import type { StreamRecordsResponse } from "./ingest_api";
import type { StreamRecordsRequest } from "./ingest_api";
import * as grpc from "@grpc/grpc-js";
/**
 * IngestAPI represents the service interface for data ingestion.
 *
 * @generated from protobuf service indykite.ingest.v1beta3.IngestAPI
 */
export interface IIngestAPIClient {
    /**
     * @generated from protobuf rpc: StreamRecords(stream indykite.ingest.v1beta3.StreamRecordsRequest) returns (stream indykite.ingest.v1beta3.StreamRecordsResponse);
     */
    streamRecords(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<StreamRecordsRequest, StreamRecordsResponse>;
    streamRecords(options?: grpc.CallOptions): grpc.ClientDuplexStream<StreamRecordsRequest, StreamRecordsResponse>;
    /**
     * @generated from protobuf rpc: IngestRecord(indykite.ingest.v1beta3.IngestRecordRequest) returns (indykite.ingest.v1beta3.IngestRecordResponse);
     */
    ingestRecord(input: IngestRecordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IngestRecordResponse) => void): grpc.ClientUnaryCall;
    ingestRecord(input: IngestRecordRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: IngestRecordResponse) => void): grpc.ClientUnaryCall;
    ingestRecord(input: IngestRecordRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IngestRecordResponse) => void): grpc.ClientUnaryCall;
    ingestRecord(input: IngestRecordRequest, callback: (err: grpc.ServiceError | null, value?: IngestRecordResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchUpsertNodes(indykite.ingest.v1beta3.BatchUpsertNodesRequest) returns (indykite.ingest.v1beta3.BatchUpsertNodesResponse);
     */
    batchUpsertNodes(input: BatchUpsertNodesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void): grpc.ClientUnaryCall;
    batchUpsertNodes(input: BatchUpsertNodesRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void): grpc.ClientUnaryCall;
    batchUpsertNodes(input: BatchUpsertNodesRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void): grpc.ClientUnaryCall;
    batchUpsertNodes(input: BatchUpsertNodesRequest, callback: (err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchUpsertRelationships(indykite.ingest.v1beta3.BatchUpsertRelationshipsRequest) returns (indykite.ingest.v1beta3.BatchUpsertRelationshipsResponse);
     */
    batchUpsertRelationships(input: BatchUpsertRelationshipsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchUpsertRelationships(input: BatchUpsertRelationshipsRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchUpsertRelationships(input: BatchUpsertRelationshipsRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchUpsertRelationships(input: BatchUpsertRelationshipsRequest, callback: (err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchDeleteNodes(indykite.ingest.v1beta3.BatchDeleteNodesRequest) returns (indykite.ingest.v1beta3.BatchDeleteNodesResponse);
     */
    batchDeleteNodes(input: BatchDeleteNodesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodes(input: BatchDeleteNodesRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodes(input: BatchDeleteNodesRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodes(input: BatchDeleteNodesRequest, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchDeleteRelationships(indykite.ingest.v1beta3.BatchDeleteRelationshipsRequest) returns (indykite.ingest.v1beta3.BatchDeleteRelationshipsResponse);
     */
    batchDeleteRelationships(input: BatchDeleteRelationshipsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationships(input: BatchDeleteRelationshipsRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationships(input: BatchDeleteRelationshipsRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationships(input: BatchDeleteRelationshipsRequest, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchDeleteNodeProperties(indykite.ingest.v1beta3.BatchDeleteNodePropertiesRequest) returns (indykite.ingest.v1beta3.BatchDeleteNodePropertiesResponse);
     */
    batchDeleteNodeProperties(input: BatchDeleteNodePropertiesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodeProperties(input: BatchDeleteNodePropertiesRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodeProperties(input: BatchDeleteNodePropertiesRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteNodeProperties(input: BatchDeleteNodePropertiesRequest, callback: (err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: BatchDeleteRelationshipProperties(indykite.ingest.v1beta3.BatchDeleteRelationshipPropertiesRequest) returns (indykite.ingest.v1beta3.BatchDeleteRelationshipPropertiesResponse);
     */
    batchDeleteRelationshipProperties(input: BatchDeleteRelationshipPropertiesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationshipProperties(input: BatchDeleteRelationshipPropertiesRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationshipProperties(input: BatchDeleteRelationshipPropertiesRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void): grpc.ClientUnaryCall;
    batchDeleteRelationshipProperties(input: BatchDeleteRelationshipPropertiesRequest, callback: (err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void): grpc.ClientUnaryCall;
}
/**
 * IngestAPI represents the service interface for data ingestion.
 *
 * @generated from protobuf service indykite.ingest.v1beta3.IngestAPI
 */
export class IngestAPIClient extends grpc.Client implements IIngestAPIClient {
    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;
    constructor(address: string, credentials: grpc.ChannelCredentials, options: grpc.ClientOptions = {}, binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }
    /**
     * @generated from protobuf rpc: StreamRecords(stream indykite.ingest.v1beta3.StreamRecordsRequest) returns (stream indykite.ingest.v1beta3.StreamRecordsResponse);
     */
    streamRecords(metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientDuplexStream<StreamRecordsRequest, StreamRecordsResponse> {
        const method = IngestAPI.methods[0];
        return this.makeBidiStreamRequest<StreamRecordsRequest, StreamRecordsResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: StreamRecordsRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): StreamRecordsResponse => method.O.fromBinary(value, this._binaryOptions), (metadata as any), options);
    }
    /**
     * @generated from protobuf rpc: IngestRecord(indykite.ingest.v1beta3.IngestRecordRequest) returns (indykite.ingest.v1beta3.IngestRecordResponse);
     */
    ingestRecord(input: IngestRecordRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IngestRecordResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IngestRecordResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: IngestRecordResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[1];
        return this.makeUnaryRequest<IngestRecordRequest, IngestRecordResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: IngestRecordRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): IngestRecordResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchUpsertNodes(indykite.ingest.v1beta3.BatchUpsertNodesRequest) returns (indykite.ingest.v1beta3.BatchUpsertNodesResponse);
     */
    batchUpsertNodes(input: BatchUpsertNodesRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchUpsertNodesResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[2];
        return this.makeUnaryRequest<BatchUpsertNodesRequest, BatchUpsertNodesResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchUpsertNodesRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchUpsertNodesResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchUpsertRelationships(indykite.ingest.v1beta3.BatchUpsertRelationshipsRequest) returns (indykite.ingest.v1beta3.BatchUpsertRelationshipsResponse);
     */
    batchUpsertRelationships(input: BatchUpsertRelationshipsRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchUpsertRelationshipsResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[3];
        return this.makeUnaryRequest<BatchUpsertRelationshipsRequest, BatchUpsertRelationshipsResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchUpsertRelationshipsRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchUpsertRelationshipsResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchDeleteNodes(indykite.ingest.v1beta3.BatchDeleteNodesRequest) returns (indykite.ingest.v1beta3.BatchDeleteNodesResponse);
     */
    batchDeleteNodes(input: BatchDeleteNodesRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchDeleteNodesResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[4];
        return this.makeUnaryRequest<BatchDeleteNodesRequest, BatchDeleteNodesResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchDeleteNodesRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchDeleteNodesResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchDeleteRelationships(indykite.ingest.v1beta3.BatchDeleteRelationshipsRequest) returns (indykite.ingest.v1beta3.BatchDeleteRelationshipsResponse);
     */
    batchDeleteRelationships(input: BatchDeleteRelationshipsRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipsResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[5];
        return this.makeUnaryRequest<BatchDeleteRelationshipsRequest, BatchDeleteRelationshipsResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchDeleteRelationshipsRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchDeleteRelationshipsResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchDeleteNodeProperties(indykite.ingest.v1beta3.BatchDeleteNodePropertiesRequest) returns (indykite.ingest.v1beta3.BatchDeleteNodePropertiesResponse);
     */
    batchDeleteNodeProperties(input: BatchDeleteNodePropertiesRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchDeleteNodePropertiesResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[6];
        return this.makeUnaryRequest<BatchDeleteNodePropertiesRequest, BatchDeleteNodePropertiesResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchDeleteNodePropertiesRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchDeleteNodePropertiesResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: BatchDeleteRelationshipProperties(indykite.ingest.v1beta3.BatchDeleteRelationshipPropertiesRequest) returns (indykite.ingest.v1beta3.BatchDeleteRelationshipPropertiesResponse);
     */
    batchDeleteRelationshipProperties(input: BatchDeleteRelationshipPropertiesRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: BatchDeleteRelationshipPropertiesResponse) => void)): grpc.ClientUnaryCall {
        const method = IngestAPI.methods[7];
        return this.makeUnaryRequest<BatchDeleteRelationshipPropertiesRequest, BatchDeleteRelationshipPropertiesResponse>(`/${IngestAPI.typeName}/${method.name}`, (value: BatchDeleteRelationshipPropertiesRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): BatchDeleteRelationshipPropertiesResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
}
