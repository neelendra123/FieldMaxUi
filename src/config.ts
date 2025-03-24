export const isProduction = process.env.NODE_ENV === 'production';

export const appName = 'FieldMax360';
export const appVersion = process.env.APP_VERSION || '1.0.0';

export const publicURL = process.env.PUBLIC_URL;
export const baseURL = process.env.REACT_APP_BASE_URL;

export const apiURL = process.env.REACT_APP_API_URL;

export const apiURLV1 = `${apiURL}v1`;
export const deviceType = 'WEB';

export const googleApiKey =
  process.env.REACT_APP_GOOGLE_MAP_KEY ||
  'AIzaSyBBUKIzfj3oC87hl_aiQMuhl7uZvShLG8A';

export const openAiToken = process.env.OPEN_AI_TOKEN || "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";