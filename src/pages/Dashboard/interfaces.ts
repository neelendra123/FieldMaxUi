import { ICommonResponse } from '../../interfaces';

import { IAccountUsageLimit } from '../Accounts/interfaces';

export interface IDashboardHomeCountData extends IAccountUsageLimit {}
export interface IDashboardHomeResData extends ICommonResponse {
  data: {
    counts: IDashboardHomeCountData;
  };
}
