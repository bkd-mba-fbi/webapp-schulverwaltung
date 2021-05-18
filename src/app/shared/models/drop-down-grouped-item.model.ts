import * as t from 'io-ts';

const DropDownGroupedItem = t.type({
  Key: t.number,
  Value: t.string,
  Group: t.string,
});

type DropDownGroupedItem = t.TypeOf<typeof DropDownGroupedItem>;
export { DropDownGroupedItem };
