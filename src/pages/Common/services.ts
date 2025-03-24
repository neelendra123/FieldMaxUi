import axios from 'axios';
import { toast } from 'react-toastify';

import { ICommonMediaUpload, IModuleKind } from '../../interfaces';

import { makePostRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';
import { dataURLToFile } from '../../utils/common';
import { clearAllToast, errorToast } from '../../utils/toast';

export const generatePreSignedURLs = async (
  data: interfaces.IPreSignedURLReqData
) => {
  const result: interfaces.IPreSignedURLResData = (
    await makePostRequest(constants.CommonApiRoutes.preSignedURLs, data)
  ).data;

  return result.data;
};

export type IUploadModuleKind =
  | IModuleKind.users
  | IModuleKind.account
  | IModuleKind.properties
  | IModuleKind.userOwners
  | 'propertyUnits';
export const uploadFileService = async (
  file: any,
  moduleKind: IUploadModuleKind
) => {
  const contentType = file.type;

  //  Generating Pre Signed URL for the file
  const signedURL = await generatePreSignedURLs({
    moduleKind,
    contentType,
  });

  const { media, mediaURL } = signedURL.data;

  await axios.put(mediaURL, file, {
    headers: {
      'Content-Type': contentType,
    },
  });

  return media;
};

//  This one converts the DataURL File to Blob, then upload it.
//  Along with nice toast message.
export const mediaUploadCommonService = async (
  media: ICommonMediaUpload,
  {
    name = 'Media',
    moduleKind,
  }: {
    name?: string;
    moduleKind: IUploadModuleKind;
  }
) => {
  try {
    //  Uploading PIC
    const toastId = toast.loading(`${name} is uploading`, {
      autoClose: 1500,
    });

    const file = await dataURLToFile(media.mediaURL, media.type, media.name);

    const upload = await uploadFileService(file, moduleKind);

    toast.update(toastId, {
      render: `${name} is uploaded 👌`,
      type: 'success',
      isLoading: false,
      autoClose: 1500,
    });

    return upload;
  } catch (error: any) {
    console.error(error);
    clearAllToast();

    errorToast(error.message);

    throw error;
  }
};
