import { lazy } from 'react';

const UserList = lazy(() => import('./List/UserList'));
const UserEdit = lazy(() => import('./Edit/UserEdit'));
const AddUser = lazy(() => import('./Add/AddUser'));

export { UserList, AddUser, UserEdit };
