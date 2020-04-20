import * as t from 'io-ts';

const DropDownItem = t.type({
  Key: t.number,
  Value: t.string,
});

type DropDownItem = t.TypeOf<typeof DropDownItem>;
export { DropDownItem };
