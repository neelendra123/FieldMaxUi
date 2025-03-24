import { lazy } from 'react';

const UserOwnerList = lazy(() => import('./List/UserOwnerList'));
const UserOwnerAdd = lazy(() => import('./Add/UserOwnerAdd'));
const UserOwnerEdit = lazy(() => import('./Edit/UserOwnerEdit'));
const UserOwnerDetails = lazy(() => import('./Details/UserOwnerDetail'));

export { UserOwnerList, UserOwnerAdd, UserOwnerEdit, UserOwnerDetails };
