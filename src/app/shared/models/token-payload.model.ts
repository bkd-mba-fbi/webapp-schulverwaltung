import * as t from "io-ts";
import { Maybe } from "./common-types";

const TokenPayload = t.type({
  culture_info: t.string,
  fullname: t.string,
  id_person: t.string,
  holder_id: t.string,
  instance_id: t.string,
  roles: t.string,
  substitution_id: Maybe(t.string),
});
type TokenPayload = t.TypeOf<typeof TokenPayload>;
export { TokenPayload };
