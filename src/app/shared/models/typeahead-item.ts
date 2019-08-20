import * as t from 'io-ts';

const TypeaheadItem = t.type({
  id: t.number,
  label: t.string
});

type TypeaheadItem = t.TypeOf<typeof TypeaheadItem>;
export { TypeaheadItem };
