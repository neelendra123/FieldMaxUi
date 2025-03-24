import axios, {
  AxiosRequestConfig,
  AxiosError,
  CancelToken,
  CancelTokenSource,
} from 'axios';

import { errorToast, warningToast } from './toast';
import { getAuthToken, getDefaultAccount } from './common';

import AuthRoutes from '../pages/Auth/routes';

import { STATUS_CODES, MESSAGES } from '../constants';

export type ICancelTokenSource = CancelTokenSource;

interface IConfig {
  skipAuth?: boolean;
  contentType?: string;
  cancelToken?: CancelToken;
  skipErrorMsg?: boolean;
}

export const generateCancelToken = async () => axios.CancelToken.source();

const errorResHandler = (error: AxiosError, config: IConfig) => {
  console.error(error);

  const statusCode = error.response?.status || error.code || STATUS_CODES.ERROR;
  const errorMsg =
    error.response?.data?.message || error.message || MESSAGES.errorMsg;

  if (parseInt(`${statusCode}`) === STATUS_CODES.AUTH_FAILED) {
    window.location.href = `${AuthRoutes.logout.path}?warningMsg=${MESSAGES.loginRequired}`;
    throw error;
  }

  if (!config.skipErrorMsg) {
    if (!axios.isCancel(error)) {
      if (
        statusCode === STATUS_CODES.ACTION_FAILED ||
        statusCode === STATUS_CODES.FORBIDDEN
      ) {
        warningToast(errorMsg);
      } else {
        errorToast(errorMsg);
      }
    } else {
      console.log('Request canceled');
    }
  }

  throw error;
};

export const makeGetRequest = (
  url: string,
  params: any = {},
  config: IConfig = {
    skipAuth: false,
    contentType: 'application/x-www-form-urlencoded',
    cancelToken: undefined,
    skipErrorMsg: false,
  }
) => {
  let headers = {
    Authorization: config.skipAuth ? null : `Bearer ${getAuthToken()}`,
    'Content-Type': config.contentType,
    accountId: '',
  };
  if (headers.Authorization) {
    const account = getDefaultAccount();

    headers.accountId = account.primaryUserId.id;
  }

  return axios
    .get(url, {
      params,
      cancelToken: config.cancelToken,
      headers,
    })
    .catch((error) => errorResHandler(error, config));
};

export const makePostRequest = (
  url: string,
  data: any = {},
  config: IConfig = {
    skipAuth: false,
    contentType: 'application/json',
    cancelToken: undefined,
    skipErrorMsg: false,
  }
) => {
  let headers = {
    Authorization: config.skipAuth ? null : `Bearer ${getAuthToken()}`,
    'Content-Type': config.contentType,
    accountId: '',
  };
  if (headers.Authorization) {
    const account = getDefaultAccount();

    headers.accountId = account.primaryUserId.id;
  }

  const reqConfig: AxiosRequestConfig = {
    cancelToken: config.cancelToken,
    headers,
  };
  return axios
    .post(url, data, reqConfig)
    .catch((error) => errorResHandler(error, config));
};

export const makeDeleteRequest = (
  url: string,
  config: IConfig = {
    contentType: 'application/json',
    cancelToken: undefined,
    skipErrorMsg: false,
  }
) => {
  let headers = {
    Authorization: config.skipAuth ? null : `Bearer ${getAuthToken()}`,
    'Content-Type': config.contentType,
    accountId: '',
  };
  if (headers.Authorization) {
    const account = getDefaultAccount();

    headers.accountId = account.primaryUserId.id;
  }

  const reqConfig: AxiosRequestConfig = {
    cancelToken: config.cancelToken,
    headers,
  };
  return axios
    .delete(url, reqConfig)
    .catch((error) => errorResHandler(error, config));
};

export const makePutRequest = (
  url: string,
  data: any = {},
  config: IConfig = {
    skipAuth: false,
    contentType: 'application/json',
    cancelToken: undefined,
    skipErrorMsg: false,
  },
  accountId: string = ''
) => {
  let headers = {
    Authorization: config.skipAuth ? null : `Bearer ${getAuthToken()}`,
    'Content-Type': config.contentType,
    accountId,
  };
  if (headers.Authorization) {
    const account = getDefaultAccount();

    headers.accountId = accountId || account.primaryUserId.id;
  }

  const reqConfig: AxiosRequestConfig = {
    cancelToken: config.cancelToken,
    headers,
  };
  return axios
    .put(url, data, reqConfig)
    .catch((error) => errorResHandler(error, config));
};
