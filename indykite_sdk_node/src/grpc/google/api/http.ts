// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "google/api/http.proto" (package "google.api", syntax proto3)
// tslint:disable
//
// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
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
/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 *
 * @generated from protobuf message google.api.Http
 */
export interface Http {
    /**
     * A list of HTTP configuration rules that apply to individual API methods.
     *
     * **NOTE:** All service configuration rules follow "last one wins" order.
     *
     * @generated from protobuf field: repeated google.api.HttpRule rules = 1;
     */
    rules: HttpRule[];
    /**
     * When set to true, URL path parameters will be fully URI-decoded except in
     * cases of single segment matches in reserved expansion, where "%2F" will be
     * left encoded.
     *
     * The default behavior is to not decode RFC 6570 reserved characters in multi
     * segment matches.
     *
     * @generated from protobuf field: bool fully_decode_reserved_expansion = 2;
     */
    fullyDecodeReservedExpansion: boolean;
}
/**
 * # gRPC Transcoding
 *
 * gRPC Transcoding is a feature for mapping between a gRPC method and one or
 * more HTTP REST endpoints. It allows developers to build a single API service
 * that supports both gRPC APIs and REST APIs. Many systems, including [Google
 * APIs](https://github.com/googleapis/googleapis),
 * [Cloud Endpoints](https://cloud.google.com/endpoints), [gRPC
 * Gateway](https://github.com/grpc-ecosystem/grpc-gateway),
 * and [Envoy](https://github.com/envoyproxy/envoy) proxy support this feature
 * and use it for large scale production services.
 *
 * `HttpRule` defines the schema of the gRPC/REST mapping. The mapping specifies
 * how different portions of the gRPC request message are mapped to the URL
 * path, URL query parameters, and HTTP request body. It also controls how the
 * gRPC response message is mapped to the HTTP response body. `HttpRule` is
 * typically specified as an `google.api.http` annotation on the gRPC method.
 *
 * Each mapping specifies a URL path template and an HTTP method. The path
 * template may refer to one or more fields in the gRPC request message, as long
 * as each field is a non-repeated field with a primitive (non-message) type.
 * The path template controls how fields of the request message are mapped to
 * the URL path.
 *
 * Example:
 *
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *             get: "/v1/{name=messages/*}"
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string name = 1; // Mapped to URL path.
 *     }
 *     message Message {
 *       string text = 1; // The resource content.
 *     }
 *
 * This enables an HTTP REST to gRPC mapping as below:
 *
 * HTTP | gRPC
 * -----|-----
 * `GET /v1/messages/123456`  | `GetMessage(name: "messages/123456")`
 *
 * Any fields in the request message which are not bound by the path template
 * automatically become HTTP query parameters if there is no HTTP request body.
 * For example:
 *
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *             get:"/v1/messages/{message_id}"
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       message SubMessage {
 *         string subfield = 1;
 *       }
 *       string message_id = 1; // Mapped to URL path.
 *       int64 revision = 2;    // Mapped to URL query parameter `revision`.
 *       SubMessage sub = 3;    // Mapped to URL query parameter `sub.subfield`.
 *     }
 *
 * This enables a HTTP JSON to RPC mapping as below:
 *
 * HTTP | gRPC
 * -----|-----
 * `GET /v1/messages/123456?revision=2&sub.subfield=foo` |
 * `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield:
 * "foo"))`
 *
 * Note that fields which are mapped to URL query parameters must have a
 * primitive type or a repeated primitive type or a non-repeated message type.
 * In the case of a repeated type, the parameter can be repeated in the URL
 * as `...?param=A&param=B`. In the case of a message type, each field of the
 * message is mapped to a separate parameter, such as
 * `...?foo.a=A&foo.b=B&foo.c=C`.
 *
 * For HTTP methods that allow a request body, the `body` field
 * specifies the mapping. Consider a REST update method on the
 * message resource collection:
 *
 *     service Messaging {
 *       rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           patch: "/v1/messages/{message_id}"
 *           body: "message"
 *         };
 *       }
 *     }
 *     message UpdateMessageRequest {
 *       string message_id = 1; // mapped to the URL
 *       Message message = 2;   // mapped to the body
 *     }
 *
 * The following HTTP JSON to RPC mapping is enabled, where the
 * representation of the JSON in the request body is determined by
 * protos JSON encoding:
 *
 * HTTP | gRPC
 * -----|-----
 * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
 * "123456" message { text: "Hi!" })`
 *
 * The special name `*` can be used in the body mapping to define that
 * every field not bound by the path template should be mapped to the
 * request body.  This enables the following alternative definition of
 * the update method:
 *
 *     service Messaging {
 *       rpc UpdateMessage(Message) returns (Message) {
 *         option (google.api.http) = {
 *           patch: "/v1/messages/{message_id}"
 *           body: "*"
 *         };
 *       }
 *     }
 *     message Message {
 *       string message_id = 1;
 *       string text = 2;
 *     }
 *
 *
 * The following HTTP JSON to RPC mapping is enabled:
 *
 * HTTP | gRPC
 * -----|-----
 * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
 * "123456" text: "Hi!")`
 *
 * Note that when using `*` in the body mapping, it is not possible to
 * have HTTP parameters, as all fields not bound by the path end in
 * the body. This makes this option more rarely used in practice when
 * defining REST APIs. The common usage of `*` is in custom methods
 * which don't use the URL at all for transferring data.
 *
 * It is possible to define multiple HTTP methods for one RPC by using
 * the `additional_bindings` option. Example:
 *
 *     service Messaging {
 *       rpc GetMessage(GetMessageRequest) returns (Message) {
 *         option (google.api.http) = {
 *           get: "/v1/messages/{message_id}"
 *           additional_bindings {
 *             get: "/v1/users/{user_id}/messages/{message_id}"
 *           }
 *         };
 *       }
 *     }
 *     message GetMessageRequest {
 *       string message_id = 1;
 *       string user_id = 2;
 *     }
 *
 * This enables the following two alternative HTTP JSON to RPC mappings:
 *
 * HTTP | gRPC
 * -----|-----
 * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
 * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id:
 * "123456")`
 *
 * ## Rules for HTTP mapping
 *
 * 1. Leaf request fields (recursive expansion nested messages in the request
 *    message) are classified into three categories:
 *    - Fields referred by the path template. They are passed via the URL path.
 *    - Fields referred by the [HttpRule.body][google.api.HttpRule.body]. They
 *    are passed via the HTTP
 *      request body.
 *    - All other fields are passed via the URL query parameters, and the
 *      parameter name is the field path in the request message. A repeated
 *      field can be represented as multiple query parameters under the same
 *      name.
 *  2. If [HttpRule.body][google.api.HttpRule.body] is "*", there is no URL
 *  query parameter, all fields
 *     are passed via URL path and HTTP request body.
 *  3. If [HttpRule.body][google.api.HttpRule.body] is omitted, there is no HTTP
 *  request body, all
 *     fields are passed via URL path and URL query parameters.
 *
 * ### Path template syntax
 *
 *     Template = "/" Segments [ Verb ] ;
 *     Segments = Segment { "/" Segment } ;
 *     Segment  = "*" | "**" | LITERAL | Variable ;
 *     Variable = "{" FieldPath [ "=" Segments ] "}" ;
 *     FieldPath = IDENT { "." IDENT } ;
 *     Verb     = ":" LITERAL ;
 *
 * The syntax `*` matches a single URL path segment. The syntax `**` matches
 * zero or more URL path segments, which must be the last part of the URL path
 * except the `Verb`.
 *
 * The syntax `Variable` matches part of the URL path as specified by its
 * template. A variable template must not contain other variables. If a variable
 * matches a single path segment, its template may be omitted, e.g. `{var}`
 * is equivalent to `{var=*}`.
 *
 * The syntax `LITERAL` matches literal text in the URL path. If the `LITERAL`
 * contains any reserved character, such characters should be percent-encoded
 * before the matching.
 *
 * If a variable contains exactly one path segment, such as `"{var}"` or
 * `"{var=*}"`, when such a variable is expanded into a URL path on the client
 * side, all characters except `[-_.~0-9a-zA-Z]` are percent-encoded. The
 * server side does the reverse decoding. Such variables show up in the
 * [Discovery
 * Document](https://developers.google.com/discovery/v1/reference/apis) as
 * `{var}`.
 *
 * If a variable contains multiple path segments, such as `"{var=foo/*}"`
 * or `"{var=**}"`, when such a variable is expanded into a URL path on the
 * client side, all characters except `[-_.~/0-9a-zA-Z]` are percent-encoded.
 * The server side does the reverse decoding, except "%2F" and "%2f" are left
 * unchanged. Such variables show up in the
 * [Discovery
 * Document](https://developers.google.com/discovery/v1/reference/apis) as
 * `{+var}`.
 *
 * ## Using gRPC API Service Configuration
 *
 * gRPC API Service Configuration (service config) is a configuration language
 * for configuring a gRPC service to become a user-facing product. The
 * service config is simply the YAML representation of the `google.api.Service`
 * proto message.
 *
 * As an alternative to annotating your proto file, you can configure gRPC
 * transcoding in your service config YAML files. You do this by specifying a
 * `HttpRule` that maps the gRPC method to a REST endpoint, achieving the same
 * effect as the proto annotation. This can be particularly useful if you
 * have a proto that is reused in multiple services. Note that any transcoding
 * specified in the service config will override any matching transcoding
 * configuration in the proto.
 *
 * Example:
 *
 *     http:
 *       rules:
 *         # Selects a gRPC method and applies HttpRule to it.
 *         - selector: example.v1.Messaging.GetMessage
 *           get: /v1/messages/{message_id}/{sub.subfield}
 *
 * ## Special notes
 *
 * When gRPC Transcoding is used to map a gRPC to JSON REST endpoints, the
 * proto to JSON conversion must follow the [proto3
 * specification](https://developers.google.com/protocol-buffers/docs/proto3#json).
 *
 * While the single segment variable follows the semantics of
 * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
 * Expansion, the multi segment variable **does not** follow RFC 6570 Section
 * 3.2.3 Reserved Expansion. The reason is that the Reserved Expansion
 * does not expand special characters like `?` and `#`, which would lead
 * to invalid URLs. As the result, gRPC Transcoding uses a custom encoding
 * for multi segment variables.
 *
 * The path variables **must not** refer to any repeated or mapped field,
 * because client libraries are not capable of handling such variable expansion.
 *
 * The path variables **must not** capture the leading "/" character. The reason
 * is that the most common use case "{var}" does not capture the leading "/"
 * character. For consistency, all path variables must share the same behavior.
 *
 * Repeated message fields must not be mapped to URL query parameters, because
 * no client library can support such complicated mapping.
 *
 * If an API needs to use a JSON array for request or response body, it can map
 * the request or response body to a repeated field. However, some gRPC
 * Transcoding implementations may not support this feature.
 *
 * @generated from protobuf message google.api.HttpRule
 */
export interface HttpRule {
    /**
     * Selects a method to which this rule applies.
     *
     * Refer to [selector][google.api.DocumentationRule.selector] for syntax
     * details.
     *
     * @generated from protobuf field: string selector = 1;
     */
    selector: string;
    /**
     * @generated from protobuf oneof: pattern
     */
    pattern: {
        oneofKind: "get";
        /**
         * Maps to HTTP GET. Used for listing and getting information about
         * resources.
         *
         * @generated from protobuf field: string get = 2;
         */
        get: string;
    } | {
        oneofKind: "put";
        /**
         * Maps to HTTP PUT. Used for replacing a resource.
         *
         * @generated from protobuf field: string put = 3;
         */
        put: string;
    } | {
        oneofKind: "post";
        /**
         * Maps to HTTP POST. Used for creating a resource or performing an action.
         *
         * @generated from protobuf field: string post = 4;
         */
        post: string;
    } | {
        oneofKind: "delete";
        /**
         * Maps to HTTP DELETE. Used for deleting a resource.
         *
         * @generated from protobuf field: string delete = 5;
         */
        delete: string;
    } | {
        oneofKind: "patch";
        /**
         * Maps to HTTP PATCH. Used for updating a resource.
         *
         * @generated from protobuf field: string patch = 6;
         */
        patch: string;
    } | {
        oneofKind: "custom";
        /**
         * The custom pattern is used for specifying an HTTP method that is not
         * included in the `pattern` field, such as HEAD, or "*" to leave the
         * HTTP method unspecified for this rule. The wild-card rule is useful
         * for services that provide content to Web (HTML) clients.
         *
         * @generated from protobuf field: google.api.CustomHttpPattern custom = 8;
         */
        custom: CustomHttpPattern;
    } | {
        oneofKind: undefined;
    };
    /**
     * The name of the request field whose value is mapped to the HTTP request
     * body, or `*` for mapping all request fields not captured by the path
     * pattern to the HTTP body, or omitted for not having any HTTP request body.
     *
     * NOTE: the referred field must be present at the top-level of the request
     * message type.
     *
     * @generated from protobuf field: string body = 7;
     */
    body: string;
    /**
     * Optional. The name of the response field whose value is mapped to the HTTP
     * response body. When omitted, the entire response message will be used
     * as the HTTP response body.
     *
     * NOTE: The referred field must be present at the top-level of the response
     * message type.
     *
     * @generated from protobuf field: string response_body = 12;
     */
    responseBody: string;
    /**
     * Additional HTTP bindings for the selector. Nested bindings must
     * not contain an `additional_bindings` field themselves (that is,
     * the nesting may only be one level deep).
     *
     * @generated from protobuf field: repeated google.api.HttpRule additional_bindings = 11;
     */
    additionalBindings: HttpRule[];
}
/**
 * A custom pattern is used for defining custom HTTP verb.
 *
 * @generated from protobuf message google.api.CustomHttpPattern
 */
export interface CustomHttpPattern {
    /**
     * The name of this custom HTTP verb.
     *
     * @generated from protobuf field: string kind = 1;
     */
    kind: string;
    /**
     * The path matched by this custom verb.
     *
     * @generated from protobuf field: string path = 2;
     */
    path: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Http$Type extends MessageType<Http> {
    constructor() {
        super("google.api.Http", [
            { no: 1, name: "rules", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => HttpRule },
            { no: 2, name: "fully_decode_reserved_expansion", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<Http>): Http {
        const message = { rules: [], fullyDecodeReservedExpansion: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Http>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Http): Http {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated google.api.HttpRule rules */ 1:
                    message.rules.push(HttpRule.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bool fully_decode_reserved_expansion */ 2:
                    message.fullyDecodeReservedExpansion = reader.bool();
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
    internalBinaryWrite(message: Http, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated google.api.HttpRule rules = 1; */
        for (let i = 0; i < message.rules.length; i++)
            HttpRule.internalBinaryWrite(message.rules[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bool fully_decode_reserved_expansion = 2; */
        if (message.fullyDecodeReservedExpansion !== false)
            writer.tag(2, WireType.Varint).bool(message.fullyDecodeReservedExpansion);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.api.Http
 */
export const Http = new Http$Type();
// @generated message type with reflection information, may provide speed optimized methods
class HttpRule$Type extends MessageType<HttpRule> {
    constructor() {
        super("google.api.HttpRule", [
            { no: 1, name: "selector", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "get", kind: "scalar", oneof: "pattern", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "put", kind: "scalar", oneof: "pattern", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "post", kind: "scalar", oneof: "pattern", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "delete", kind: "scalar", oneof: "pattern", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "patch", kind: "scalar", oneof: "pattern", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "custom", kind: "message", oneof: "pattern", T: () => CustomHttpPattern },
            { no: 7, name: "body", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "response_body", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "additional_bindings", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => HttpRule }
        ]);
    }
    create(value?: PartialMessage<HttpRule>): HttpRule {
        const message = { selector: "", pattern: { oneofKind: undefined }, body: "", responseBody: "", additionalBindings: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<HttpRule>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HttpRule): HttpRule {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string selector */ 1:
                    message.selector = reader.string();
                    break;
                case /* string get */ 2:
                    message.pattern = {
                        oneofKind: "get",
                        get: reader.string()
                    };
                    break;
                case /* string put */ 3:
                    message.pattern = {
                        oneofKind: "put",
                        put: reader.string()
                    };
                    break;
                case /* string post */ 4:
                    message.pattern = {
                        oneofKind: "post",
                        post: reader.string()
                    };
                    break;
                case /* string delete */ 5:
                    message.pattern = {
                        oneofKind: "delete",
                        delete: reader.string()
                    };
                    break;
                case /* string patch */ 6:
                    message.pattern = {
                        oneofKind: "patch",
                        patch: reader.string()
                    };
                    break;
                case /* google.api.CustomHttpPattern custom */ 8:
                    message.pattern = {
                        oneofKind: "custom",
                        custom: CustomHttpPattern.internalBinaryRead(reader, reader.uint32(), options, (message.pattern as any).custom)
                    };
                    break;
                case /* string body */ 7:
                    message.body = reader.string();
                    break;
                case /* string response_body */ 12:
                    message.responseBody = reader.string();
                    break;
                case /* repeated google.api.HttpRule additional_bindings */ 11:
                    message.additionalBindings.push(HttpRule.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: HttpRule, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string selector = 1; */
        if (message.selector !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.selector);
        /* string get = 2; */
        if (message.pattern.oneofKind === "get")
            writer.tag(2, WireType.LengthDelimited).string(message.pattern.get);
        /* string put = 3; */
        if (message.pattern.oneofKind === "put")
            writer.tag(3, WireType.LengthDelimited).string(message.pattern.put);
        /* string post = 4; */
        if (message.pattern.oneofKind === "post")
            writer.tag(4, WireType.LengthDelimited).string(message.pattern.post);
        /* string delete = 5; */
        if (message.pattern.oneofKind === "delete")
            writer.tag(5, WireType.LengthDelimited).string(message.pattern.delete);
        /* string patch = 6; */
        if (message.pattern.oneofKind === "patch")
            writer.tag(6, WireType.LengthDelimited).string(message.pattern.patch);
        /* google.api.CustomHttpPattern custom = 8; */
        if (message.pattern.oneofKind === "custom")
            CustomHttpPattern.internalBinaryWrite(message.pattern.custom, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* string body = 7; */
        if (message.body !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.body);
        /* string response_body = 12; */
        if (message.responseBody !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.responseBody);
        /* repeated google.api.HttpRule additional_bindings = 11; */
        for (let i = 0; i < message.additionalBindings.length; i++)
            HttpRule.internalBinaryWrite(message.additionalBindings[i], writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.api.HttpRule
 */
export const HttpRule = new HttpRule$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CustomHttpPattern$Type extends MessageType<CustomHttpPattern> {
    constructor() {
        super("google.api.CustomHttpPattern", [
            { no: 1, name: "kind", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "path", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<CustomHttpPattern>): CustomHttpPattern {
        const message = { kind: "", path: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<CustomHttpPattern>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CustomHttpPattern): CustomHttpPattern {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string kind */ 1:
                    message.kind = reader.string();
                    break;
                case /* string path */ 2:
                    message.path = reader.string();
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
    internalBinaryWrite(message: CustomHttpPattern, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string kind = 1; */
        if (message.kind !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.kind);
        /* string path = 2; */
        if (message.path !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.path);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.api.CustomHttpPattern
 */
export const CustomHttpPattern = new CustomHttpPattern$Type();
