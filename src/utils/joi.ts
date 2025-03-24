import Joi, { ValidationOptions } from 'joi';

import * as common from './common';

const DefaultValidationOptions = {
  abortEarly: false,
  allowUnknown: true,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const validateData = (
  data: any,
  schema: Joi.Schema,
  config: ValidationOptions = {}
) => {
  const result = schema.validate(data, {
    ...DefaultValidationOptions,
    ...config,
  });

  let errors: any = null;

  result.error?.details.map((detail: Joi.ValidationErrorItem) => {
    if (!errors) {
      errors = {};
    }
    //  This one create custom key in errors
    const key = detail.path[0] || `${detail?.context?.key}`;
    // detail.path.join('.'); //`${detail?.context?.key}`

    errors[key] = common.capitalizeFirstLetter(detail.message);

    return null;
  });

  console.info({
    msg: 'Validation Result',
    errors,
    data,
    result,
  });

  return {
    errors,
    data: result.value,
    result,
  };
};
