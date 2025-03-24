import { IModuleKind } from '../../../interfaces';

import NotesList from '../../Notes/List/NotesList';

interface TabNotesProps {
  userOwnerId: string;
}

export default function TabNotes({ userOwnerId }: TabNotesProps) {
  return (
    <NotesList
      currentNotes={[]}
      kind={IModuleKind.userOwners}
      userOwnerId={userOwnerId}
    />
  );
}
