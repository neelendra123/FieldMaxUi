import { Fragment, useState, memo } from 'react';
import { useMountedState } from 'react-use';

import { validateData } from '../../../utils/joi';

import { TextInputComp } from '../../../components/Forms';

import { IAuthUser } from '../../Auth/interfaces';

import { generateUserIdPopulated } from '../../Users/utils';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';
import { successToast } from '../../../utils/toast';

const DefaultFormError = {
  message: '',
};
const ConversationAdd = ({
  kind,
  jobId,
  mediaId,
  subMediaId,

  user,

  addEffect,
}: {
  kind: interfaces.IConversationKinds;
  jobId: string;
  mediaId?: string;
  subMediaId?: string;

  user: IAuthUser;

  addEffect: (
    conversation: interfaces.IConvPopulatedTypes,
    msg: string
  ) => void;
}) => {
  const isMounted = useMountedState();

  const [isFetching, setIsFetching] = useState(false);

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(DefaultFormError);

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const data: interfaces.IConversationAddReqData = {
      kind,
      message,
      jobId,
      mediaId,
    };
    if (subMediaId) {
      data.subMediaId = subMediaId;
    }

    const validate = validateData(data, constants.AddConversationJoiScheme);

    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    try {
      const result = await services.conversationAddService(data);
      if (!isMounted()) {
        return;
      }

      const conversation: interfaces.IConvPopulatedTypes = {
        ...result.data.conversation,
        kind,
        creatorId: generateUserIdPopulated(user),
      };

      //  Updating Parent Component
      addEffect(conversation, result.message);

    } catch (error) {}
    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
    setMessage('');
  };

  return (
    <Fragment>
      <form onSubmit={formSubmitted}>
        <div className="form-group send-tab-btn">
          <TextInputComp
            name="message"
            type="text"
            className="form-control"
            placeholder="Type your message..."
            onChange={setMessage}
            value={message}
            disabled={isFetching}
            errorMsg={errors.message}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFetching}
          >
            Send
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default memo(ConversationAdd);
