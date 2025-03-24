import Joi from 'joi';

export const googleDirectionPath = (
  lat: number,
  lng: number,
  formatted?: string
) => {
  if (!lat && !lng) {
    return `https://www.google.com/maps?saddr=My+Location&daddr=${formatted}`;
  }

  // https://stackoverflow.com/questions/11354211/google-maps-query-parameter-clarification
  return `https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`;
};

export const generateCommonAddressJoiSchema = ({
  formattedLabel = 'Address',
  formattedRequired = false,
}: {
  formattedLabel?: string;
  formattedRequired?: boolean;
}) => {
  let formatted = Joi.string().trim().label(`${formattedLabel}`);

  if (formattedRequired) {
    formatted = formatted.required();
  } else {
    formatted = formatted.allow('').optional();
  }

  return Joi.object()
    .keys({
      formatted,
      name: Joi.string()
        .trim()
        .allow('')
        .optional()
        .label(`${formattedLabel} Name`),

      line1: Joi.string().trim().allow('').optional().label('Line 1'),
      line2: Joi.string().trim().allow('').optional().label('Line 2'),
      city: Joi.string().trim().allow('').optional().label('City'),
      state: Joi.string().trim().allow('').optional().label('State'),
      zipCode: Joi.string().trim().allow('').optional().label('Zip Code'),
      country: Joi.string().trim().allow('').optional().label('Country'),

      location: Joi.object()
        .keys({
          type: Joi.string().valid('Point').required(),
          coordinates: Joi.array()
            .items(Joi.number().required())
            .min(2)
            .required(),
        })
        .required(),
    })
    .options({});
};
