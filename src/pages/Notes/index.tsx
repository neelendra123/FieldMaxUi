import { lazy } from 'react';

const NotesList = lazy(() => import('./List/NotesList'));
const NoteAdd = lazy(() => import('./Add/NoteAdd'));

export { NotesList, NoteAdd };
