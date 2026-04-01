import * as t from "io-ts";
import { LocalDateTimeFromString, Option } from "./common-types";

const AdditionalInformation = t.type({
  Id: t.number,
  ObjectId: t.number,
  ObjectTypeId: t.number,
  Designation: t.string,
  File: Option(t.string),
  TypeId: t.number,
  Description: Option(t.string),
  CodeId: Option(t.number),
  // "StudyCourseId": null,
  // "RetentionPeriodInYears": null,
  ForStudent: t.boolean,
  ForJobTrainer: t.boolean,
  CreationDate: LocalDateTimeFromString,
  CreatorName: t.string,
  // "HRef": "/restApi/AdditionalInformations/1001"
});

type AdditionalInformation = t.TypeOf<typeof AdditionalInformation>;
export { AdditionalInformation };
