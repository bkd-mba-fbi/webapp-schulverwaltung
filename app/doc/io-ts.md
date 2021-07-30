# API Data Contract (Data Decoding)

[back](../README.md)

## Introduction

Since the backend of this application is developed and operated by a
third party, we use [io-ts](https://github.com/gcanti/io-ts) to ensure
the received data from the API conforms to the expectations. The
mechanism works as follows:

- We define runtime (io-ts) types.
- We derive the compile-time TypeScript types from these runtime types.
- We decode the received data over the API using the defined runtime
  types. If the data does not comply to the definition, a
  `DecodeError` exception is thrown. The discrepancy can therefore be
  discovered at the earliest possible stage, with a very clear
  description of the problem. Any subsequent errors and undefined
  behavior of the application can be prevented.
- We use custom types (like `LocalDateTimeFromString` and `LocalDateFromString`) to transform data.

## Best Practices

### Type Definition

Runtime types are described in a `.model.ts` file in the `src/app/shared/models` directory:

```
import * as t from 'io-ts';

const Person = t.type({
  Id: t.number,
  FirstName: t.string,
  LastName: t.string
});

type Person = t.TypeOf<typeof Person>;
export { Person };
```

The runtime and TypeScript types are exported under the same name and
can be used in their appropriate contexts without having to think
about which one to use.

### Avoid Checking Unused Properties

Any additional properties that are received but are not used within
the application (e.g. a `MatriculationNumber` on `Person`), should be
omitted from the type definition. These properties then stay in the
decoded object, but are ignored when type checking. The goal is to not
generate unnecessary exceptions.

### Decoding

The `decode` and `decodeArray` utility functions can be used to
type-check and decode the received data:

```
function getPerson(id: number): Observable<Person> {
  return this.http
    .get<unknown>(`/api/Persons/${id}`)
    .pipe(switchMap(decode(Person)))
    .subscribe(...);
}
```
