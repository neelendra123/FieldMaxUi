import { useEffect } from 'react';

import { IModuleKind } from '../../../interfaces';

import { INotePopulated } from '../../Notes/interfaces';
import NotesList from '../../Notes/List/NotesList';

import * as interfaces from '../interfaces';

interface TabNotesProps {
  notes: INotePopulated[];
  setNotes: (notes: INotePopulated[]) => void;

  backupDataFunc: (
    newBackup?: interfaces.IUserOwnerCreateEditBackup,
    newTab?: interfaces.IOwnerCreateUpdateTabsType
  ) => void;

  userOwnerId: string;
}

export default function TabNotes({
  notes,
  setNotes,
  backupDataFunc,

  userOwnerId,
}: TabNotesProps) {
  const addEffect = async (note: INotePopulated) => {
    setNotes([...notes, note]);
  };

  useEffect(() => {
    backupDataFunc(undefined, interfaces.IOwnerCreateUpdateTabsType.notes);
  }, [notes]);

  return (
    <NotesList
      currentNotes={notes}
      kind={IModuleKind.userOwners}
      addEffect={addEffect}
      isCreatingModule
      userOwnerId={userOwnerId}
    />
  );
}
