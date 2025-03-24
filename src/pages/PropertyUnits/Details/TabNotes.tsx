import { IModuleKind } from '../../../interfaces';

import NotesList from '../../Notes/List/NotesList';

interface TabNotesProps {
  propertyId: string;
  propertyUnitId: string;
}

export default function TabNotes({
  propertyId,
  propertyUnitId,
}: TabNotesProps) {
  return (
    <NotesList
      currentNotes={[]}
      propertyId={propertyId}
      propertyUnitId={propertyUnitId}
      kind={IModuleKind.properties}
      subKind="propertyUnits"
    />
  );
}
