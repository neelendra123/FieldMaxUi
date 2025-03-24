import { IModuleKind } from '../../../interfaces';

import { INotePopulated } from '../../Notes/interfaces';
import NotesList from '../../Notes/List/NotesList';

interface TabNotesProps {
  notes: INotePopulated[];
  setNotes: (notes: INotePopulated[]) => void;

  propertyId?: string;
  propertyUnitId: string;
}

export default function TabNotes({
  notes,
  setNotes,
  propertyId,
  propertyUnitId,
}: TabNotesProps) {
  const addEffect = async (note: INotePopulated) => {
    setNotes([...notes, note]);
  };

  return (
    <NotesList
      currentNotes={notes}
      kind={IModuleKind.properties}
      subKind="propertyUnits"
      addEffect={addEffect}
      isCreatingModule
      propertyId={propertyId}
      propertyUnitId={propertyUnitId}
    />
  );
}
