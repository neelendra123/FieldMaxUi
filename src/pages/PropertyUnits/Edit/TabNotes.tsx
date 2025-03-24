import { IModuleKind } from '../../../interfaces';

import NotesList from '../../Notes/List/NotesList';

interface TabNotesProps {
  propertyUnitId: string;
  propertyId: string;
}

export default function TabNotes({
  propertyUnitId,
  propertyId,
}: TabNotesProps) {
  return (
    <NotesList
      currentNotes={[]}
      kind={IModuleKind.properties}
      subKind="propertyUnits"
      propertyId={propertyId}
      propertyUnitId={propertyUnitId}
    />
  );
}
