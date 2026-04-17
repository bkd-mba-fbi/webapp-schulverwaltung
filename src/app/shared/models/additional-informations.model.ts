import * as t from "io-ts";
import { LocalDateTimeFromString, Option } from "./common-types";
import { DropDownItem } from "./drop-down-item.model";

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

const AdditionalInformationCode = t.intersection([
  DropDownItem,
  t.type({
    IsActive: t.boolean,
    Sort: t.string,
  }),
]);

type AdditionalInformation = t.TypeOf<typeof AdditionalInformation>;
type AdditionalInformationCode = t.TypeOf<typeof AdditionalInformationCode>;
export { AdditionalInformation, AdditionalInformationCode };
