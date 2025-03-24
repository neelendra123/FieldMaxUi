import { ICommonAddress } from '../../interfaces';
import { DefaultCommonAddress } from '../../pages/Address/constants';

export const convertGoogleResultToCommonAddress = (
  place: any
): ICommonAddress => {
  if (!place) {
    return { ...DefaultCommonAddress };
  }

  let address: ICommonAddress = {
    formatted: place.formatted_address,
    name: '',
    line1: place.name,
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    location: {
      type: 'Point',
      coordinates: [
        place.geometry.location.lat(),
        place.geometry.location.lng(),
      ],
    },
  };

  for (let i = 0; i < place.address_components?.length; i++) {
    let type = place.address_components[i].types?.[0];
    let longName = place.address_components[i].long_name || '';
    let shortName = place.address_components[i].short_name || '';

    switch (type) {
      case 'neighborhood': {
        if (!address.line1) {
          address.line1 = longName || shortName;
        }
        break;
      }
      case 'street_number': {
        if (!address.line1) {
          address.line1 = longName || shortName;
        }
        break;
      }
      case 'sublocality_level_1': {
        address.line2 = longName || shortName;
        break;
      }
      case 'administrative_area_level_1': {
        address.state = longName || shortName;
        break;
      }
      case 'administrative_area_level_2': {
        address.city = longName || shortName;
        break;
      }
      case 'postal_code': {
        address.zipCode = longName || shortName;
        break;
      }
      case 'country': {
        address.country = longName || shortName;
        break;
      }
    }
  }

  return address;
};
