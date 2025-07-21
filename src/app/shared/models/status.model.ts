import * as t from "io-ts";

const Status = t.type({
  IdStatus: t.number,
  Status: t.string,
  IsDelete: t.boolean,
});

type Status = t.TypeOf<typeof Status>;
export { Status };
