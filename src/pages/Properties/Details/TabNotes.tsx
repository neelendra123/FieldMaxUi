import { IModuleKind } from '../../../interfaces';

import NotesList from '../../Notes/List/NotesList';

interface TabNotesProps {
  propertyId: string;
}

export default function TabNotes({ propertyId }: TabNotesProps) {
  return (
    <NotesList
      currentNotes={[]}
      propertyId={propertyId}
      kind={IModuleKind.properties}
    />
  );
}
