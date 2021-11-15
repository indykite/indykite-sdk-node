# Generate the Library

## Node Library

Install the [grpc-tool](https://www.npmjs.com/package/grpc-tools) from npm.
Install the [ts-proto](https://github.com/stephenh/ts-proto)
Use with [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js).

```
npm i -g grpc-tools google-protobuf @types/google-protobuf ts-proto
```

Working sample:

- last command used to generate current TS files:

```
protoc --plugin=/usr/local/bin/protoc-gen-ts_proto \
--ts_proto_opt=context=false \
--ts_proto_opt=oneof=unions \
--ts_proto_opt=env=node \
--ts_proto_opt=useOptionals=true \
--ts_proto_opt=addGrpcMetadata=true \
--ts_proto_opt=outputServices=grpc-js \
--ts_proto_opt=stringEnums=false \
--ts_proto_opt=forceLong=string \
--ts_proto_out=./src/grpc \
-I. -I ../../ptypes/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
-I ../../ptypes/github.com/googleapis/googleapis/ \
-I ../../ptypes/github.com/envoyproxy/protoc-gen-validate/ \
-I ../../ptypes/github.com/grpc-ecosystem/grpc-gateway \
identity/v1/identity_management_api.proto \
identity/v1/model.proto \
identity/v1/attributes.proto \
identity/v1/authenteq.proto \
identity/v1/document.proto \
identity/v1/import.proto \
flow/proto/flow.proto \
config/v1/config_management_api.proto \
config/v1/model.proto \
objects/struct.proto \
objects/id.proto \
google/protobuf/timestamp.proto \
google/protobuf/any.proto \
google/protobuf/duration.proto \
google/protobuf/struct.proto \
google/protobuf/wrappers.proto \
google/type/latlng.proto \
google/protobuf/descriptor.proto \
google/api/annotations.proto \
google/api/http.proto \
google/api/field_behavior.proto \
validate/validate.proto
```
