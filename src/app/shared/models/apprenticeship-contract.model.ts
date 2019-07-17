import * as t from 'io-ts';
import { Reference, Option } from './common-types';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';

const ApprenticeshipContract = t.type({
  Id: t.number,
  JobTrainerRef: Reference,
  StudentRef: Reference,
  ApprenticeshipManagerId: t.number,
  ApprenticeshipDateFrom: t.string, // TODO
  ApprenticeshipDateTo: t.string, // TODO
  CompanyName: t.string,
  ContractDateFrom: Option(DateFromISOString),
  ContractDateTo: Option(DateFromISOString),
  ContractNumber: t.string,
  ContractTermination: Option(DateFromISOString),
  ContractType: t.string,
  JobCode: t.number,
  JobVersion: t.number,
  HRef: t.string
});

type ApprenticeshipContract = t.TypeOf<typeof ApprenticeshipContract>;
export { ApprenticeshipContract };

export type ApprenticeshipContractProps = t.PropsOf<
  typeof ApprenticeshipContract
>;
