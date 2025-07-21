import * as t from "io-ts";

const Status = t.intersection([
  t.partial({
    IsDelete: t.boolean,
  }),
  t.type({
    IdStatus: t.number,
    Status: t.string,
  }),
]);

type Status = t.TypeOf<typeof Status>;
export { Status };
