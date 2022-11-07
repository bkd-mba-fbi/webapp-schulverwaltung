import * as t from 'io-ts';

const DropDownItem = t.type({
  Key: t.union([t.number, t.string]),
  Value: t.string,
});

type DropDownItem = t.TypeOf<typeof DropDownItem>;
export { DropDownItem };
