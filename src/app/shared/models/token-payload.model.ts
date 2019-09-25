import * as t from 'io-ts';

const TokenPayload = t.type({
  culture_info: t.string,
  fullname: t.string,
  id_person: t.number,
  instance_id: t.string,
  roles: t.string
});
type TokenPayload = t.TypeOf<typeof TokenPayload>;
export { TokenPayload };
