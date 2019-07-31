import * as t from 'io-ts';
import { Maybe, Option } from './common-types';

const ApprenticeshipContract = t.type({
  Id: t.number,
  JobTrainer: t.number,
  // StudentRef: Reference,
  ApprenticeshipManagerId: t.number,
  ApprenticeshipDateFrom: t.string,
  ApprenticeshipDateTo: t.string,
  CompanyName: Maybe(t.string)
  // ContractDateFrom: Option(DateFromISOString),
  // ContractDateTo: Option(DateFromISOString),
  // ContractNumber: t.string,
  // ContractTermination: Option(DateFromISOString),
  // ContractType: t.string,
  // JobCode: t.number,
  // JobVersion: t.number,
  // HRef: t.string
});

type ApprenticeshipContract = t.TypeOf<typeof ApprenticeshipContract>;
export { ApprenticeshipContract };

export type ApprenticeshipContractProps = t.PropsOf<
  typeof ApprenticeshipContract
>;
