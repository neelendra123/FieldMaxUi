import { Fragment } from 'react';
import { Facebook } from 'react-content-loader';

import * as interfaces from './interfaces';

export const ConversationsSkeleton = (props: {
  keys: number[];
  kind: interfaces.IConversationKinds;
}) => {
  return (
    <Fragment>
      {props.keys.map((key) => {
        if (props.kind === interfaces.IConversationKinds.conversation) {
          //  This is for left and right like a conversation
          return <Facebook key={key} rtl={!!!(key % 2)} />;
        }

        return <Facebook key={key} />;
      })}
    </Fragment>
  );
};
