import { Fragment, useState, memo, ChangeEvent } from 'react';
import { useMountedState } from 'react-use';
import axios from 'axios';
import { toast } from 'react-toastify';

import { ImAttachment } from 'react-icons/im';

import { validateData } from '../../../utils/joi';
import { successToast, warningToast } from '../../../utils/toast';
import { dataURLToFile } from '../../../utils/common';

import { TextInputComp } from '../../../components/Forms';
import { CrossIconBlack, DocIcon, PlayIcon } from '../../../components/Icons';

import { IAuthUser } from '../../Auth/interfaces';

import { generateUserIdPopulated } from '../../Users/utils';

import { IMediaKind } from '../../Medias/interfaces';
import { fileGenerateThumb } from '../../Medias/utils';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';
import { IsFetching } from '../../../components/Common';

export interface NoteAddProps {
  user: IAuthUser;

  kind: interfaces.INoteKind;
  subKind?: interfaces.INoteSubKind;

  userId?: string;
  userOwnerId?: string;
  jobId?: string;
  propertyId?: string;
  propertyUnitId?: string;

  addEffect?: (note: interfaces.INotePopulated) => void;
}

const DefaultFormError = {
  note: '',
};

const NoteAdd = ({
  kind,
  subKind,

  userId,
  userOwnerId,
  jobId,
  propertyId,
  propertyUnitId,

  user,

  addEffect,
}: NoteAddProps) => {
  const isMounted = useMountedState();

  const [isFetching, setIsFetching] = useState(false);

  const [message, setMessage] = useState('');
  const [medias, setMedias] = useState<interfaces.IMediaUpload[]>([]);

  const [errors, setErrors] = useState({ ...DefaultFormError });

  const selectingFromGalleryEffect = async ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    //  This is called once user selects medias from the gallery

    if (!files?.length) {
      setMedias([...medias]);
      return;
    }

    const newMedias: interfaces.IMediaUpload[] = [...medias];

    for (let i = 0; i < files.length; i++) {
      const contentType = files[i].type;
      const contentTypeSplitted = contentType.split('/');

      const name = files[i].name;
      const mediaURL = window.URL.createObjectURL(files[i]);

      if (contentTypeSplitted[0] === 'video') {
        //  If Image or Document
        const thumbnailURL = await fileGenerateThumb(files[i]);

        newMedias.push({
          kind: IMediaKind.Video,
          name,
          mediaURL,
          contentType,
          thumbnailURL,
        });
      } else {
        const kind =
          contentTypeSplitted[0] === 'image'
            ? IMediaKind.Photo
            : IMediaKind.Doc;

        newMedias.push({
          kind,
          name,
          mediaURL,
          contentType,
        });
      }
    }

    setMedias(newMedias);
  };

  const deleteMediaEffect = (mediaIndex: number) => {
    const newMedias = medias.filter((media, index) => {
      return mediaIndex != index;
    });

    setMedias(newMedias);
  };

  const uploadFiles = async (): Promise<
    Omit<interfaces.INoteMedia, 'id'>[]
  > => {
    const result: Omit<interfaces.INoteMedia, 'id'>[] = [];

    if (!medias.length) {
      return result;
    }

    const toastId = toast.loading('Medias are uploading', {
      autoClose: 1500,
    });

    //  Uploading to S3 all videos, thumbnail
    const uploadPromises = [];

    const signedURLs = await services.noteMediaPreSignedURLsService({
      kind,
      subKind,
      medias,
    });

    for (let i = 0; i < signedURLs.length; i++) {
      const { media, mediaURL, thumbnail, thumbnailURL } = signedURLs[i];

      const mediaContentType = medias[i].contentType;
      const thumbnailContentType = 'image/png';

      //  Converting DataURL to files
      const [mediaFile, thumbnailFile] = await Promise.all([
        dataURLToFile(medias[i].mediaURL, mediaContentType, media),
        thumbnail
          ? dataURLToFile(
              medias[i].thumbnailURL as string,
              thumbnailContentType,
              thumbnail
            )
          : null,
      ]);

      uploadPromises.push(
        //  Uploading media to S3
        axios.put(mediaURL, mediaFile, {
          headers: { 'Content-Type': mediaContentType },
        })
      );

      if (thumbnailFile) {
        //  Uploading thumbnail to S3
        uploadPromises.push(
          axios.put(thumbnailURL, thumbnailFile, {
            headers: { 'Content-Type': thumbnailContentType },
          })
        );
      }

      result.push({
        kind: medias[i].kind,
        name: medias[i].name,
        media,
        thumbnail,
      });
    }

    await Promise.all(uploadPromises);

    toast.update(toastId, {
      render: 'Medias are uploaded 👌',
      type: 'success',
      isLoading: false,
      autoClose: 1500,
    });

    return result;
  };

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const data: interfaces.INoteAddReqData = {
      kind,
      subKind,
      userId,
      userOwnerId,
      jobId,
      propertyId,
      propertyUnitId,

      note: message,
      medias: [],
    };

    try {
      const validate = validateData(data, constants.NoteCreateValSchema);
      if (validate.errors) {
        const errors = Object.values(validate.errors);
        warningToast(errors[0] as string);

        setErrors(validate.errors);
        return;
      }

      setIsFetching(true);
      setErrors({ ...DefaultFormError });

      data.medias = await uploadFiles();

      const result = await services.noteCreateService(data);
      if (!isMounted()) {
        return;
      }

      const note: interfaces.INotePopulated = {
        ...result.data.record,
        creatorId: generateUserIdPopulated(user),
      };

      setMessage('');
      setMedias([]);

      //  Updating Parent Component State
      addEffect?.(note);

      successToast(result.message);

      //  This is temp solution for dismissing media upload toast
      // setTimeout(() => {
      //   toast.dismiss();
      // }, 1500);
    } catch (error) {
      toast.dismiss();
    }
    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  return (
    <Fragment>
      {isFetching && <IsFetching />}

      <form onSubmit={formSubmitted}>
        <div className="notes-input-container">
          <div className="form-group position-relative">
            <TextInputComp
              name="note"
              type="text"
              className="form-control"
              placeholder="Type your note..."
              value={message}
              onChange={setMessage}
              disabled={isFetching}
              errorMsg={errors.note}
            />

            <div className="btn-with-attach">
              <label className="mb-0" htmlFor="attachment">
                <div className="attach-btn">
                  <ImAttachment />
                </div>
                <input
                  type="file"
                  className="d-none"
                  id="attachment"
                  disabled={isFetching}
                  accept="image/*,video/*,application/pdf"
                  multiple
                  onChange={selectingFromGalleryEffect}
                />
              </label>

              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={isFetching}
              >
                Send
              </button>
            </div>
          </div>

          {!!medias.length && (
            <div className="d-flex flex-wrap pb-1">
              {medias.map((med, index) => {
                const onClick = () => {
                  if (isFetching) {
                    return;
                  }

                  deleteMediaEffect(index);
                };

                if (med.kind === IMediaKind.Photo) {
                  /* image  */
                  return (
                    <div className="note-img ml-2 mb-2" key={index}>
                      <img src={med.mediaURL} alt={med.name} title={med.name} />
                      <CrossIconBlack
                        className="close-icon"
                        onClick={onClick}
                      />
                    </div>
                  );
                } else if (med.kind === IMediaKind.Video) {
                  /* video */
                  return (
                    <div className="note-video ml-2 mb-2" key={index}>
                      <img
                        src={med.thumbnailURL}
                        alt={med.name}
                        title={med.name}
                      />
                      <div className="video-icon" title={med.name}>
                        <PlayIcon />
                      </div>
                      <CrossIconBlack
                        className="close-icon"
                        onClick={onClick}
                      />
                    </div>
                  );
                } else {
                  /* document */
                  return (
                    <div className="note-doc ml-2 mb-2" key={index}>
                      <DocIcon title={med.name} />
                      <CrossIconBlack
                        className="close-icon"
                        onClick={onClick}
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </form>
    </Fragment>
  );
};

export default memo(NoteAdd);
