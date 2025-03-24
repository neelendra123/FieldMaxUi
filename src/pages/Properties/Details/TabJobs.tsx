import { Fragment } from 'react';
// import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

// import { DummyPhotoBase64 } from '../../../constants';

import { toLocaleDTString } from '../../../utils/common';

import { DirectionIcon } from '../../../components/Icons';

import { googleDirectionPath } from '../../Address/utils';

import { IPropertyJobPopulated } from '../../Jobs/interfaces';

interface TabJobsProps {
  jobs: IPropertyJobPopulated[];
}

export default function TabJobs({ jobs }: TabJobsProps) {
  const RowsComponent = () => {
    return (
      <Fragment>
        {jobs.map((job) => {
          return (
            <tr key={job.id}>
              <td className="text-bold">
                <div className="flex-content profile-name">
                  {/* <img
                    src={DummyPhotoBase64}
                    alt={'No Photo'}
                    title={'No Photo'}
                  /> */}

                  <div className="text-field-content">
                    <h6 className="mb-1 ">
                      <div className="text-dark ">
                        <b>{job.title}</b>
                      </div>
                    </h6>
                    <span>
                      <span className="dot" />
                      {toLocaleDTString(job.createdAt)}
                    </span>
                  </div>
                </div>
              </td>
              <td
                className="address-field"
                onClick={() => {
                  const googlePath = googleDirectionPath(
                    job.address.location.coordinates[0],
                    job.address.location.coordinates[1],
                    job.address.formatted
                  );

                  window.open(googlePath, '_blank');
                }}
              >
                <div className="d-flex justify-content-between fz-14-12">
                  {job.address.formatted}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="d-block d-md-none"
                  >
                    <DirectionIcon />
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </Fragment>
    );
  };

  return (
    <div>
      <div className="user-table-wrap job-table-wrap jobs-grid-table mobile-table">
        <div className="table-wrap">
          <table className="table">
            <thead className="mobile-d-none">
              <tr>
                <th scope="col">
                  <div className="flex-content" onClick={() => {}}>
                    Name
                    {/* {true ? (
                      <FaSortAmountUp className="ml-2" />
                    ) : (
                      <FaSortAmountDown className="ml-2" />
                    )} */}
                  </div>
                </th>
                <th scope="col">
                  <div className="flex-content"> Address </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <RowsComponent />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
