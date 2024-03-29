// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/knowledge/v1beta1/identity_knowledge_api.proto" (package "indykite.knowledge.v1beta1", syntax proto3)
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
import { IdentityKnowledgeAPI } from "./identity_knowledge_api";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IdentityKnowledgeResponse } from "./identity_knowledge_api";
import type { IdentityKnowledgeRequest } from "./identity_knowledge_api";
import * as grpc from "@grpc/grpc-js";
/**
 * IdentityKnowledgeAPI represents the service interface for the Identity Knowledge API.
 *
 * @generated from protobuf service indykite.knowledge.v1beta1.IdentityKnowledgeAPI
 */
export interface IIdentityKnowledgeAPIClient {
    /**
     * @generated from protobuf rpc: IdentityKnowledge(indykite.knowledge.v1beta1.IdentityKnowledgeRequest) returns (indykite.knowledge.v1beta1.IdentityKnowledgeResponse);
     */
    identityKnowledge(input: IdentityKnowledgeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void): grpc.ClientUnaryCall;
    identityKnowledge(input: IdentityKnowledgeRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void): grpc.ClientUnaryCall;
    identityKnowledge(input: IdentityKnowledgeRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void): grpc.ClientUnaryCall;
    identityKnowledge(input: IdentityKnowledgeRequest, callback: (err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void): grpc.ClientUnaryCall;
}
/**
 * IdentityKnowledgeAPI represents the service interface for the Identity Knowledge API.
 *
 * @generated from protobuf service indykite.knowledge.v1beta1.IdentityKnowledgeAPI
 */
export class IdentityKnowledgeAPIClient extends grpc.Client implements IIdentityKnowledgeAPIClient {
    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;
    constructor(address: string, credentials: grpc.ChannelCredentials, options: grpc.ClientOptions = {}, binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }
    /**
     * @generated from protobuf rpc: IdentityKnowledge(indykite.knowledge.v1beta1.IdentityKnowledgeRequest) returns (indykite.knowledge.v1beta1.IdentityKnowledgeResponse);
     */
    identityKnowledge(input: IdentityKnowledgeRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: IdentityKnowledgeResponse) => void)): grpc.ClientUnaryCall {
        const method = IdentityKnowledgeAPI.methods[0];
        return this.makeUnaryRequest<IdentityKnowledgeRequest, IdentityKnowledgeResponse>(`/${IdentityKnowledgeAPI.typeName}/${method.name}`, (value: IdentityKnowledgeRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): IdentityKnowledgeResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
}
