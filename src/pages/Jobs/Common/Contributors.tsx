import { Fragment } from 'react';

import { strInitials } from '../../../utils/common';

import * as interfaces from '../interfaces';
import * as constants from '../constants';

export default function Contributors({
  contributors = [],
  mostContributorIndex = -1,
  mostRecentContributorIndex = -1,

  maxUsersShow = 3,
}: {
  contributors: interfaces.IJobUserPopulated[];
  mostContributorIndex: number;
  mostRecentContributorIndex: number;

  maxUsersShow?: number;
}) {
  return (
    <Fragment>
      {contributors.map((contributor, index) => {
        //  At the moment only showing 4 contributors at max
        if (index > maxUsersShow) {
          return null;
        }

        const { id, firstName, lastName, email } = contributor.userId;
        const { details } = contributor;

        const nameInitials = strInitials(`${firstName} ${lastName || ''}`);

        return (
          <span
            key={`${id}-${index}`}
            className={`btn-box ${constants.ContributorColorClasses[index]}`}
            title={email}
          >
            {mostRecentContributorIndex === index && (
              <img
                src={require('../../../assets/images/btn-icon.png').default}
                alt="Most Recent Contributor"
                title="Most Recent Contributor"
              />
            )}
            {nameInitials.toUpperCase()} ({details.contributionCount})
          </span>
        );
      })}
    </Fragment>
  );
}
