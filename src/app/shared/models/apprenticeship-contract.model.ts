import * as t from "io-ts";
import { LocalDateTimeFromString, Maybe, Option } from "./common-types";

const ApprenticeshipContract = t.type({
  Id: t.number,
  JobTrainer: Option(t.number),
  // StudentRef: Reference,
  ApprenticeshipManagerId: t.number,
  // ApprenticeshipDateFrom: t.string,
  // ApprenticeshipDateTo: t.string,
  // CompanyName: Maybe(t.string),
  // CompanyNameAddition: Maybe(t.string),
  ContractDateFrom: Option(LocalDateTimeFromString),
  ContractDateTo: Option(LocalDateTimeFromString),
  // ContractNumber: t.string,
  // ContractTermination: Option(LocalDateFromString),
  // ContractType: t.string,
  // JobCode: t.number,
  // JobVersion: t.number,
  // HRef: t.string
});

const StudentCompany = t.type({
  Id: t.number,
  StudentId: t.number,
  CompanyName: Maybe(t.string),
  CompanyNameAddition: Maybe(t.string),
});

type ApprenticeshipContract = t.TypeOf<typeof ApprenticeshipContract>;
type StudentCompany = t.TypeOf<typeof StudentCompany>;
export { ApprenticeshipContract, StudentCompany };
