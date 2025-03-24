import { Fragment } from 'react';

import ContentLoader from 'react-content-loader';

export const UsersTableRowSkeletonComponent = ({
  rows = 5,
}: {
  rows: number;
}) => {
  return (
    <>
      {[...new Array(rows)].map((r, index) => (
        <Fragment key={`skeleton${index}`}>
          <div className="mobile-d-none">
            <ContentLoader style={{ width: '100%' }} viewBox="0 0 1400 50">
              <rect x="5" y="0" rx="5" ry="5" width="20" height="20" />
              <rect x="40" y="0" rx="4" ry="4" width="100" height="20" />
              <rect x="320" y="0" rx="3" ry="3" width="150" height="20" />
              <rect x="550" y="0" rx="3" ry="3" width="70" height="20" />
              <rect x="720" y="0" rx="3" ry="3" width="100" height="20" />
              <rect x="870" y="0" rx="3" ry="3" width="100" height="20" />
              <rect x="1200" y="0" rx="3" ry="3" width="40" height="20" />
              <rect x="1250" y="0" rx="3" ry="3" width="40" height="20" />
            </ContentLoader>
          </div>
          <div className="d-block d-sm-block d-md-none">
            <ContentLoader style={{ width: '100%' }}>
              <circle cx="20" cy="20" r="20" />
              <rect x="50" y="0" rx="4" ry="4" width="150" height="10" />
              <rect x="50" y="20" rx="3" ry="3" width="150" height="10" />
              <rect x="325" y="0" rx="3" ry="3" width="25" height="25" />
              <rect x="0" y="50" rx="3" ry="3" width="500" height="2" />
              <rect x="0" y="60" rx="3" ry="3" width="125" height="15" />
              <rect x="150" y="60" rx="3" ry="3" width="150" height="15" />
              <rect x="0" y="90" rx="3" ry="3" width="400" height="15" />
            </ContentLoader>
          </div>
        </Fragment>
      ))}
    </>
  );
};
