import { Fragment, useState } from 'react';
import { useMountedState } from 'react-use';

import { FaCopy } from 'react-icons/fa';

import { CommonPerms } from '../../../constants';

import { copy2Clipboard } from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import { Popup } from '../../../components/Common';

import { IMediaLinkPermission } from '../../Links/interfaces';
import { mediaLinkAddService } from '../../Links/services';
import { generateMediaLinkPath } from '../../Links/utils';

import { IMediaKind, IMediaTypes } from '../interfaces';

export default function MediaLinkAddPopup({
  sharePopup = {
    mediaKind: IMediaKind.JobPhoto,
    subMediaId: '',
  },
  setSharePopup,
}: {
  sharePopup: {
    mediaKind: IMediaTypes;
    subMediaId: string;
  };
  setSharePopup: (value: {
    mediaKind: IMediaTypes;
    subMediaId: string;
  }) => void;
}) {
  const isMounted = useMountedState();

  const [isCreating, setIsCreating] = useState(false);

  const [permissions, setPermissions] = useState<IMediaLinkPermission>({
    medias: CommonPerms.view,
    details: CommonPerms.view,
    comments: CommonPerms.view,
  });

  const [mediaLink, setMediaLink] = useState('');

  const onChangePermission = (
    isChecked: boolean,
    stateKeyType: 'medias' | 'details' | 'comments'
  ) => {
    let newValue = CommonPerms.none;
    if (isChecked) {
      newValue = CommonPerms.view;
    }

    setPermissions({
      ...permissions,
      [stateKeyType]: newValue,
    });
  };

  const onSave = async () => {
    setMediaLink('');
    setIsCreating(true);

    try {
      const result = await mediaLinkAddService(
        sharePopup.mediaKind,
        sharePopup.subMediaId,
        {
          permissions,
        }
      );
      if (!isMounted()) {
        return;
      }

      const publicMediaLink = generateMediaLinkPath(result.data.data.token);
      setMediaLink(publicMediaLink);

      successToast(result.message);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsCreating(false);
  };

  return (
    <Fragment>
      <Popup
        isOpen={!!sharePopup.subMediaId}
        title="Share Media"
        onClose={() =>
          setSharePopup({
            mediaKind: IMediaKind.JobPhoto,
            subMediaId: '',
          })
        }
        addClassToWrapper="card-media-box"
        hideButton={false}
        ModalName="Generate Public Link"
        disableButtons={isCreating}
        onSave={onSave}
      >
        <div className="container">
          <div className="row">
            <h5>Link Permissions</h5>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="max-checkbox fs-12">
                <div className="">
                  <input
                    className="styled-checkbox"
                    id="medias"
                    type="checkbox"
                    checked={!!(permissions.medias & CommonPerms.view)}
                    onChange={(event) => {
                      onChangePermission(event.target.checked, 'medias');
                    }}
                  />
                  <label htmlFor="medias">
                    {(sharePopup.mediaKind === IMediaKind.JobPhoto ||
                      sharePopup.mediaKind === IMediaKind.Photo) &&
                      'Photo'}
                    {(sharePopup.mediaKind === IMediaKind.JobVideo ||
                      sharePopup.mediaKind === IMediaKind.Video) &&
                      'Video'}
                    {(sharePopup.mediaKind === IMediaKind.JobDoc ||
                      sharePopup.mediaKind === IMediaKind.Doc) &&
                      'Document'}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="max-checkbox fs-12">
                <div className="">
                  <input
                    className="styled-checkbox"
                    id="details"
                    type="checkbox"
                    checked={!!(permissions.details & CommonPerms.view)}
                    onChange={(event) => {
                      onChangePermission(event.target.checked, 'details');
                    }}
                  />
                  <label htmlFor="details">Details</label>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="max-checkbox fs-12">
                <div className="">
                  <input
                    className="styled-checkbox"
                    id="comments"
                    type="checkbox"
                    checked={!!(permissions.comments & CommonPerms.view)}
                    onChange={(event) => {
                      onChangePermission(event.target.checked, 'comments');
                    }}
                  />
                  <label htmlFor="comments">Comments</label>
                </div>
              </div>
            </div>
          </div>

          {!!mediaLink && (
            <div className="row">
              <div className="col-8">
                <input className="form-control" defaultValue={mediaLink} />
              </div>
              <div className="col-4">
                <button
                  className="btn btn-success"
                  disabled={isCreating}
                  onClick={() => copy2Clipboard(mediaLink, 'Media Link')}
                >
                  <FaCopy />
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Fragment>
  );
}
