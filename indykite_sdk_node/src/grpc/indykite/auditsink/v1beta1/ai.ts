// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/auditsink/v1beta1/ai.proto" (package "indykite.auditsink.v1beta1", syntax proto3)
// tslint:disable
//
// Copyright (c) 2024 IndyKite
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
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Duration } from "../../../google/protobuf/duration";
import { AuthorizationDigitalTwin } from "./authorization";
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.IsChangePoint
 */
export interface IsChangePoint {
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.AuthorizationDigitalTwin resolved_digital_twin = 1;
     */
    resolvedDigitalTwin?: AuthorizationDigitalTwin;
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.IsChangePoint.Request request = 2;
     */
    request?: IsChangePoint_Request;
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection change_point_detected = 3;
     */
    changePointDetected?: IsChangePoint_ChangePointDetection;
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.IsChangePoint.Response response = 4;
     */
    response?: IsChangePoint_Response;
    /**
     * @generated from protobuf field: google.protobuf.Duration evaluation_time = 5;
     */
    evaluationTime?: Duration;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.IsChangePoint.Request
 */
export interface IsChangePoint_Request {
    /**
     * @generated from protobuf field: string resource = 1;
     */
    resource: string;
    /**
     * A list of actions the subject want to perform.
     *
     * @generated from protobuf field: string action = 2;
     */
    action: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection
 */
export interface IsChangePoint_ChangePointDetection {
    /**
     * @generated from protobuf field: bool is_change = 1;
     */
    isChange: boolean;
    /**
     * explanation of change
     *
     * @generated from protobuf field: string explanation = 2;
     */
    explanation: string;
    /**
     * change score of changepoint event
     *
     * @generated from protobuf field: double change_score = 3;
     */
    changeScore: number;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.IsChangePoint.Response
 */
export interface IsChangePoint_Response {
    /**
     * Time the changepoint occurred.
     *
     * @generated from protobuf field: string decision_time = 1;
     */
    decisionTime: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class IsChangePoint$Type extends MessageType<IsChangePoint> {
    constructor() {
        super("indykite.auditsink.v1beta1.IsChangePoint", [
            { no: 1, name: "resolved_digital_twin", kind: "message", T: () => AuthorizationDigitalTwin },
            { no: 2, name: "request", kind: "message", T: () => IsChangePoint_Request },
            { no: 3, name: "change_point_detected", kind: "message", T: () => IsChangePoint_ChangePointDetection },
            { no: 4, name: "response", kind: "message", T: () => IsChangePoint_Response },
            { no: 5, name: "evaluation_time", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<IsChangePoint>): IsChangePoint {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IsChangePoint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsChangePoint): IsChangePoint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.AuthorizationDigitalTwin resolved_digital_twin */ 1:
                    message.resolvedDigitalTwin = AuthorizationDigitalTwin.internalBinaryRead(reader, reader.uint32(), options, message.resolvedDigitalTwin);
                    break;
                case /* indykite.auditsink.v1beta1.IsChangePoint.Request request */ 2:
                    message.request = IsChangePoint_Request.internalBinaryRead(reader, reader.uint32(), options, message.request);
                    break;
                case /* indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection change_point_detected */ 3:
                    message.changePointDetected = IsChangePoint_ChangePointDetection.internalBinaryRead(reader, reader.uint32(), options, message.changePointDetected);
                    break;
                case /* indykite.auditsink.v1beta1.IsChangePoint.Response response */ 4:
                    message.response = IsChangePoint_Response.internalBinaryRead(reader, reader.uint32(), options, message.response);
                    break;
                case /* google.protobuf.Duration evaluation_time */ 5:
                    message.evaluationTime = Duration.internalBinaryRead(reader, reader.uint32(), options, message.evaluationTime);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IsChangePoint, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.AuthorizationDigitalTwin resolved_digital_twin = 1; */
        if (message.resolvedDigitalTwin)
            AuthorizationDigitalTwin.internalBinaryWrite(message.resolvedDigitalTwin, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.IsChangePoint.Request request = 2; */
        if (message.request)
            IsChangePoint_Request.internalBinaryWrite(message.request, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection change_point_detected = 3; */
        if (message.changePointDetected)
            IsChangePoint_ChangePointDetection.internalBinaryWrite(message.changePointDetected, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.IsChangePoint.Response response = 4; */
        if (message.response)
            IsChangePoint_Response.internalBinaryWrite(message.response, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Duration evaluation_time = 5; */
        if (message.evaluationTime)
            Duration.internalBinaryWrite(message.evaluationTime, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.IsChangePoint
 */
export const IsChangePoint = new IsChangePoint$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IsChangePoint_Request$Type extends MessageType<IsChangePoint_Request> {
    constructor() {
        super("indykite.auditsink.v1beta1.IsChangePoint.Request", [
            { no: 1, name: "resource", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "action", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<IsChangePoint_Request>): IsChangePoint_Request {
        const message = { resource: "", action: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IsChangePoint_Request>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsChangePoint_Request): IsChangePoint_Request {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string resource */ 1:
                    message.resource = reader.string();
                    break;
                case /* string action */ 2:
                    message.action = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IsChangePoint_Request, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string resource = 1; */
        if (message.resource !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.resource);
        /* string action = 2; */
        if (message.action !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.action);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.IsChangePoint.Request
 */
export const IsChangePoint_Request = new IsChangePoint_Request$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IsChangePoint_ChangePointDetection$Type extends MessageType<IsChangePoint_ChangePointDetection> {
    constructor() {
        super("indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection", [
            { no: 1, name: "is_change", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "explanation", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "change_score", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<IsChangePoint_ChangePointDetection>): IsChangePoint_ChangePointDetection {
        const message = { isChange: false, explanation: "", changeScore: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IsChangePoint_ChangePointDetection>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsChangePoint_ChangePointDetection): IsChangePoint_ChangePointDetection {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool is_change */ 1:
                    message.isChange = reader.bool();
                    break;
                case /* string explanation */ 2:
                    message.explanation = reader.string();
                    break;
                case /* double change_score */ 3:
                    message.changeScore = reader.double();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IsChangePoint_ChangePointDetection, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool is_change = 1; */
        if (message.isChange !== false)
            writer.tag(1, WireType.Varint).bool(message.isChange);
        /* string explanation = 2; */
        if (message.explanation !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.explanation);
        /* double change_score = 3; */
        if (message.changeScore !== 0)
            writer.tag(3, WireType.Bit64).double(message.changeScore);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.IsChangePoint.ChangePointDetection
 */
export const IsChangePoint_ChangePointDetection = new IsChangePoint_ChangePointDetection$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IsChangePoint_Response$Type extends MessageType<IsChangePoint_Response> {
    constructor() {
        super("indykite.auditsink.v1beta1.IsChangePoint.Response", [
            { no: 1, name: "decision_time", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<IsChangePoint_Response>): IsChangePoint_Response {
        const message = { decisionTime: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IsChangePoint_Response>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsChangePoint_Response): IsChangePoint_Response {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string decision_time */ 1:
                    message.decisionTime = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IsChangePoint_Response, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string decision_time = 1; */
        if (message.decisionTime !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.decisionTime);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.IsChangePoint.Response
 */
export const IsChangePoint_Response = new IsChangePoint_Response$Type();
