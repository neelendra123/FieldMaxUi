import { Fragment, FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { DummyPhotoBase64 } from '../../../constants';

import { BigDocIcon } from '../../../components/Icons';

import * as interfaces from '../interfaces';
import * as utils from '../utils';

interface TimelineMediaIconProps {
  jobId?: string;
  media: interfaces.IJobPhoto | interfaces.IJobVideo | interfaces.IJobDoc;
  selectedSubMediaId?: string;
}

const TimelineMediaIcon: FunctionComponent<TimelineMediaIconProps> = ({
  jobId,
  media,
  selectedSubMediaId,
}) => {
  const { mediaDetailsPath } = utils.mediaPathsGenerator(
    jobId,
    media.id,
    media.kind
  );

  const { kind } = media;

  return (
    <div className="media-box-content mb-0">
      <div className="d-flex">
        <Link
          to={{
            pathname: mediaDetailsPath,
            state: {
              mediaSubKind: media.subKind,
              selectedSubMediaId,
            },
          }}
          className="media-box-img-link"
        >
          {kind === interfaces.IMediaKind.JobDoc && (
            <BigDocIcon title={media.name} />
          )}

          {kind === interfaces.IMediaKind.JobVideo && (
            <Fragment>
              <img
                src={media.medias[0].thumbnailURL || DummyPhotoBase64}
                alt={media.name}
                title={media.name}
              />
            </Fragment>
          )}

          {kind === interfaces.IMediaKind.JobPhoto && (
            <Fragment>
              {selectedSubMediaId ? (
                <Fragment>
                  {media.medias.map((subMedia) => {
                    if (subMedia.id === selectedSubMediaId) {
                      return (
                        <img
                          src={subMedia.mediaURL}
                          alt={subMedia.name}
                          title={subMedia.name}
                          key={subMedia.id}
                        />
                      );
                    }
                    return null;
                  })}
                </Fragment>
              ) : (
                <Fragment>
                  {media.medias.map((subMedia) => {
                    return (
                      <img
                        src={subMedia.mediaURL}
                        alt={subMedia.name}
                        title={subMedia.name}
                        key={subMedia.id}
                      />
                    );
                  })}
                </Fragment>
              )}
            </Fragment>
          )}
        </Link>
      </div>
    </div>
  );
};

export default TimelineMediaIcon;
