import { ICommonAddress } from '../../interfaces';

export const DefaultCommonAddress: ICommonAddress = {
  formatted: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  location: {
    type: 'Point',
    coordinates: [0, 0],
  },
};

export const DefaultAddressError: Omit<ICommonAddress, 'location'> & {
  latitude: string;
  longitude: string;
} = {
  formatted: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  latitude: '',
  longitude: '',
};
