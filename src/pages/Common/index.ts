import { lazy } from 'react';

const CommonEmailsCreateEdit = lazy(() => import('./CommonEmailsCreateEdit'));
const CommonPhoneNumbersCreateEdit = lazy(
  () => import('./CommonPhoneNumbersCreateEdit')
);

export { CommonEmailsCreateEdit, CommonPhoneNumbersCreateEdit };
