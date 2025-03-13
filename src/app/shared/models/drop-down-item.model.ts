import * as t from "io-ts";

const DropDownItem = t.type({
  Key: t.union([t.number, t.string]),
  Value: t.string,
});

const DropDownItemWithActive = t.type({
  Key: t.union([t.number, t.string]),
  Value: t.string,
  IsActive: t.boolean,
});

type DropDownItem = t.TypeOf<typeof DropDownItem>;
type DropDownItemWithActive = t.TypeOf<typeof DropDownItemWithActive>;
export { DropDownItem, DropDownItemWithActive };
