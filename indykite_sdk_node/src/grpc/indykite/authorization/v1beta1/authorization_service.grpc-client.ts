// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/authorization/v1beta1/authorization_service.proto" (package "indykite.authorization.v1beta1", syntax proto3)
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
import { AuthorizationAPI } from "./authorization_service";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { WhoAuthorizedResponse } from "./authorization_service";
import type { WhoAuthorizedRequest } from "./authorization_service";
import type { WhatAuthorizedResponse } from "./authorization_service";
import type { WhatAuthorizedRequest } from "./authorization_service";
import type { IsAuthorizedResponse } from "./authorization_service";
import type { IsAuthorizedRequest } from "./authorization_service";
import * as grpc from "@grpc/grpc-js";
/**
 * AuthorizationAPI represents the service interface for authorization.
 * Validation fails if a request contains an unknown field.
 *
 * @generated from protobuf service indykite.authorization.v1beta1.AuthorizationAPI
 */
export interface IAuthorizationAPIClient {
    /**
     * @generated from protobuf rpc: IsAuthorized(indykite.authorization.v1beta1.IsAuthorizedRequest) returns (indykite.authorization.v1beta1.IsAuthorizedResponse);
     */
    isAuthorized(input: IsAuthorizedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void): grpc.ClientUnaryCall;
    isAuthorized(input: IsAuthorizedRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void): grpc.ClientUnaryCall;
    isAuthorized(input: IsAuthorizedRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void): grpc.ClientUnaryCall;
    isAuthorized(input: IsAuthorizedRequest, callback: (err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: WhatAuthorized(indykite.authorization.v1beta1.WhatAuthorizedRequest) returns (indykite.authorization.v1beta1.WhatAuthorizedResponse);
     */
    whatAuthorized(input: WhatAuthorizedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whatAuthorized(input: WhatAuthorizedRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whatAuthorized(input: WhatAuthorizedRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whatAuthorized(input: WhatAuthorizedRequest, callback: (err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: WhoAuthorized(indykite.authorization.v1beta1.WhoAuthorizedRequest) returns (indykite.authorization.v1beta1.WhoAuthorizedResponse);
     */
    whoAuthorized(input: WhoAuthorizedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whoAuthorized(input: WhoAuthorizedRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whoAuthorized(input: WhoAuthorizedRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void): grpc.ClientUnaryCall;
    whoAuthorized(input: WhoAuthorizedRequest, callback: (err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void): grpc.ClientUnaryCall;
}
/**
 * AuthorizationAPI represents the service interface for authorization.
 * Validation fails if a request contains an unknown field.
 *
 * @generated from protobuf service indykite.authorization.v1beta1.AuthorizationAPI
 */
export class AuthorizationAPIClient extends grpc.Client implements IAuthorizationAPIClient {
    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;
    constructor(address: string, credentials: grpc.ChannelCredentials, options: grpc.ClientOptions = {}, binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }
    /**
     * @generated from protobuf rpc: IsAuthorized(indykite.authorization.v1beta1.IsAuthorizedRequest) returns (indykite.authorization.v1beta1.IsAuthorizedResponse);
     */
    isAuthorized(input: IsAuthorizedRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: IsAuthorizedResponse) => void)): grpc.ClientUnaryCall {
        const method = AuthorizationAPI.methods[0];
        return this.makeUnaryRequest<IsAuthorizedRequest, IsAuthorizedResponse>(`/${AuthorizationAPI.typeName}/${method.name}`, (value: IsAuthorizedRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): IsAuthorizedResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: WhatAuthorized(indykite.authorization.v1beta1.WhatAuthorizedRequest) returns (indykite.authorization.v1beta1.WhatAuthorizedResponse);
     */
    whatAuthorized(input: WhatAuthorizedRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: WhatAuthorizedResponse) => void)): grpc.ClientUnaryCall {
        const method = AuthorizationAPI.methods[1];
        return this.makeUnaryRequest<WhatAuthorizedRequest, WhatAuthorizedResponse>(`/${AuthorizationAPI.typeName}/${method.name}`, (value: WhatAuthorizedRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): WhatAuthorizedResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: WhoAuthorized(indykite.authorization.v1beta1.WhoAuthorizedRequest) returns (indykite.authorization.v1beta1.WhoAuthorizedResponse);
     */
    whoAuthorized(input: WhoAuthorizedRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: WhoAuthorizedResponse) => void)): grpc.ClientUnaryCall {
        const method = AuthorizationAPI.methods[2];
        return this.makeUnaryRequest<WhoAuthorizedRequest, WhoAuthorizedResponse>(`/${AuthorizationAPI.typeName}/${method.name}`, (value: WhoAuthorizedRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): WhoAuthorizedResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
}
