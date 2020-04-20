import * as t from 'io-ts';
import { Maybe, Option, LocalDateTimeFromString } from './common-types';

const ApprenticeshipContract = t.type({
  Id: t.number,
  JobTrainer: Option(t.number),
  // StudentRef: Reference,
  ApprenticeshipManagerId: t.number,
  // ApprenticeshipDateFrom: t.string,
  // ApprenticeshipDateTo: t.string,
  CompanyName: Maybe(t.string),
  ContractDateFrom: Option(LocalDateTimeFromString),
  ContractDateTo: Option(LocalDateTimeFromString),
  // ContractNumber: t.string,
  // ContractTermination: Option(LocalDateFromString),
  // ContractType: t.string,
  // JobCode: t.number,
  // JobVersion: t.number,
  // HRef: t.string
});

type ApprenticeshipContract = t.TypeOf<typeof ApprenticeshipContract>;
export { ApprenticeshipContract };
