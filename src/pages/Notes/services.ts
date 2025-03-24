import { makeGetRequest, makePostRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const noteCreateService = async (data: interfaces.INoteAddReqData) => {
  const result: interfaces.INoteAddResData = (
    await makePostRequest(constants.NotesApiRoutes.base, data)
  ).data;

  return result;
};

export const noteMediaPreSignedURLsService = async (
  data: interfaces.INoteMediaPreSignedURLsAddParams
) => {
  const result: interfaces.INoteMediaPreSignedURLsResData = (
    await makePostRequest(constants.NotesApiRoutes.preSignedURLs, data)
  ).data;

  return result.data.data;
};

export const notesListService = async (data: interfaces.INotesListReqData) => {
  const result: interfaces.INotesListResData = (
    await makeGetRequest(constants.NotesApiRoutes.base, data)
  ).data;

  return result.data.records;
};
