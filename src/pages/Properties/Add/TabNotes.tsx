import { useEffect } from 'react';

import { IModuleKind } from '../../../interfaces';

import { INotePopulated } from '../../Notes/interfaces';
import NotesList from '../../Notes/List/NotesList';

import * as interfaces from '../interfaces';

interface TabNotesProps {
  notes: INotePopulated[];
  setNotes: (notes: INotePopulated[]) => void;

  backupDataFunc: (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab?: interfaces.IPropertyCreateUpdateTabsType
  ) => void;

  propertyId: string;
}

export default function TabNotes({
  notes,
  setNotes,
  backupDataFunc,

  propertyId,
}: TabNotesProps) {
  const addEffect = async (note: INotePopulated) => {
    setNotes([...notes, note]);
  };

  useEffect(() => {
    backupDataFunc(undefined, interfaces.IPropertyCreateUpdateTabsType.notes);
  }, [notes]);

  return (
    <NotesList
      currentNotes={notes}
      kind={IModuleKind.properties}
      addEffect={addEffect}
      isCreatingModule
      propertyId={propertyId}
    />
  );
}
