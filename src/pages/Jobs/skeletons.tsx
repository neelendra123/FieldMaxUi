import { Fragment } from 'react';
import ContentLoader, { Instagram, Facebook } from 'react-content-loader';

export const MediaSkeletonComponent = (props: { keys: number[] }) => {
  return (
    <Fragment>
      {props.keys.map((key) => {
        return (
          <div className="blog-image-content" key={key}>
            <div className="media-box-img-link">
              <Instagram className="imageLoader" />
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export const JobsTableRowSkeletonComponent = ({
  rows = 5,
}: {
  rows: number;
}) => {
  return (
    <Fragment>
      {[...new Array(rows)].map((r, index) => {
        return (
          <Fragment key={index}>
            <div className="mobile-d-none">
              <ContentLoader
                speed={123}
                style={{ width: '100%' }}
                viewBox="0 0 1500 100"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="4" ry="4" width="60" height="60" />
                <rect x="260" y="15" rx="4" ry="4" width="200" height="30" />
                <rect x="550" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="600" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="650" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="700" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="900" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="950" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="1000" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="1200" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="1250" y="15" rx="8" ry="8" width="30" height="25" />
                <rect x="1300" y="15" rx="8" ry="8" width="30" height="25" />
              </ContentLoader>
            </div>
            <div className="d-block d-sm-block d-md-none">
              <ContentLoader
                speed={123}
                // style={{width: '100%'}}
                viewBox="0 0 1000 600"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="20" y="0" rx="4" ry="4" width="100" height="100" />
                <rect x="175" y="0" rx="4" ry="4" width="500" height="40" />
                <rect x="175" y="60" rx="4" ry="4" width="500" height="30" />
                <rect x="800" y="0" rx="4" ry="4" width="50" height="50 " />
                <rect x="800" y="60" rx="4" ry="4" width="50" height="50 " />
                <rect x="20" y="120" rx="4" ry="4" width="200" height="30" />
                <rect x="20" y="180" rx="4" ry="4" width="100" height="100" />
                <rect x="150" y="180" rx="4" ry="4" width="100" height="100" />
                <rect x="280" y="180" rx="4" ry="4" width="100" height="100" />
                <rect x="410" y="180" rx="4" ry="4" width="100" height="100" />
                <rect x="20" y="300" rx="4" ry="4" width="200" height="30" />
                <rect x="20" y="350" rx="4" ry="4" width="150" height="75" />
                <rect x="200" y="350" rx="4" ry="4" width="150" height="75" />
                <rect x="380" y="350" rx="4" ry="4" width="150" height="75" />
                <rect x="20" y="450" rx="4" ry="4" width="700" height="15" />
              </ContentLoader>
            </div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export const JobCommentsSkeleton = (props: { keys: number[] }) => {
  return (
    <Fragment>
      {props.keys.map((key) => {
        return <Facebook key={key} />;
      })}
    </Fragment>
  );
};
