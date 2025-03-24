import { useState, useEffect, useRef, Fragment } from 'react';
import { useMountedState } from 'react-use';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';

import { CommonPerms } from '../../../constants';

import { ListLGIcon, ListMDIcon, ListSMIcon } from '../../../components/Icons';

import { IMediaKind, IMediaPopulatedTypes } from '../../Medias/interfaces';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import { MediaSkeletonComponent } from '../skeletons';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';
import { MediaListingComponent } from './Common';

export default function TabMedia({
  job,
  setJob,
  userJobPerm,
}: {
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  userJobPerm: IJobSubModulePerms;
}) {
  const isMounted = useMountedState();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [tabType, setTabType] = useState<'sm' | 'md' | 'lg'>('sm');

  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [dropDownToggle2, setDropDownToggle2] = useState(false);
  const refDropDownToggle = useRef<HTMLButtonElement>(null);
  const refDropDownToggle2 = useRef<HTMLButtonElement>(null);

  //  Dynamic Data
  const [groupBy, setGroupBy] = useState<'date' | 'contributor'>('date');
  const [medias, setMedias] = useState<IMediaPopulatedTypes[]>([]);

  const [parsedMedias, setParsedMedias] = useState<
    interfaces.IJobDetailsTabMediaList[]
  >([]);

  ///  This is for various options in the group like: sorting, selecting
  const [groupOptions, setGroupOptions] =
    useState<interfaces.IJobDetailsTabMediaGroupOptions>({});

  const [selectedMedias, setSelectedMedias] = useState<Record<string, boolean>>(
    {}
  );

  const checkOutside = (event: Event) => {
    if (!isMounted()) {
      return;
    }

    if (!refDropDownToggle?.current?.contains(event.target as Node)) {
      setDropDownToggle(false);
    }
    if (!refDropDownToggle2?.current?.contains(event.target as Node)) {
      setDropDownToggle2(false);
    }
  };

  const fetchData = async () => {
    try {
      const result = await services.jobMediasListService(job.id, {
        kind: IMediaKind.JobPhoto,
        userPopulate: true,
      });

      if (!isMounted()) {
        return;
      }
      setIsLoaded(true);
      setMedias(result);

      let mediaPhotosCount = 0;
      let mediaVideosCount = 0;
      result.forEach((jobMedia) => {
        if (jobMedia.kind === IMediaKind.JobPhoto) {
          mediaPhotosCount++;
        } else {
          mediaVideosCount++;
        }
      });

      //  Updating parent Job Medias Count
      setJob({
        ...job,
        details: {
          ...job.details,
          mediaPhotosCount,
          mediaVideosCount,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.querySelector('body')!.addEventListener('click', checkOutside);

    //  Only Loading the Medias if have permissions
    if (
      !!(
        userJobPerm.mediaPhotos &
        (CommonPerms.all | CommonPerms.view | CommonPerms.edit)
      )
    ) {
      fetchData();
    }

    return () => {
      window.removeEventListener('resize', checkOutside);
    };
  }, []);

  //  Updating the grouping of Medias on every change in: GroupBy,
  useEffect(() => {
    if (!medias.length) {
      return;
    }

    const newParsedMedias = utils.parseJobDetailsTabMedias(
      groupBy,
      groupOptions,
      selectedMedias,
      medias
    );

    setParsedMedias(newParsedMedias);
  }, [groupBy, groupOptions, selectedMedias, medias]);

  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        <div className="main-heading-wrap flex-space-between">
          <div className="d-none d-md-block">
            <div className="media-image-wrap flex-content">
              <div
                className={
                  tabType === 'sm'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListSMIcon onClick={setTabType} />
              </div>
              <div
                className={
                  tabType === 'md'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListMDIcon onClick={setTabType} />
              </div>
              <div
                className={
                  tabType === 'lg'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListLGIcon onClick={setTabType} />
              </div>
            </div>
          </div>
          <div className="flex-content mobile-w-100">
            <div
              className={
                dropDownToggle
                  ? 'dropdown pr-md-4 pr-0 profile-dropdown dropdown-open'
                  : 'dropdown pr-md-4 pr-0 profile-dropdown'
              }
            >
              <button
                ref={refDropDownToggle}
                className="dropdown-toggle btn btn-primary px-0 fz-18"
                onClick={() => setDropDownToggle(!dropDownToggle)}
              >
                <span className="fz-16">
                  {' '}
                  {groupBy === 'date' ? 'By Date' : 'By Contributors'}{' '}
                </span>{' '}
                <FiChevronDown className="fz-24 color-primary" />
              </button>
              <div
                className="dropdown-menu media-date-res"
                aria-labelledby="dropdownMenuLink"
              >
                <button
                  className="dropdown-item flex-space-between"
                  onClick={() => setGroupBy('date')}
                >
                  <span>By Date</span>
                  {groupBy === 'date' && <i className="fas fa-check" />}
                </button>
                <button
                  className="dropdown-item flex-space-between"
                  onClick={() => setGroupBy('contributor')}
                >
                  <span>By Contributors</span>
                  {groupBy === 'contributor' && <i className="fas fa-check" />}
                </button>
              </div>
            </div>
            <div className="media-image-wrap flex-content ml-auto d-md-none">
              <div
                className={
                  tabType === 'sm'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListSMIcon onClick={setTabType} />
              </div>
              <div
                className={
                  tabType === 'md'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListMDIcon onClick={setTabType} />
              </div>
              <div
                className={
                  tabType === 'lg'
                    ? 'media-img-state p-1 active'
                    : 'media-img-state p-1'
                }
              >
                <ListLGIcon onClick={setTabType} />
              </div>
            </div>
            <div className="btn-wrap d-none d-md-block">
              <div
                className={
                  dropDownToggle2
                    ? 'dropdown profile-dropdown dropdown-open'
                    : 'dropdown profile-dropdown'
                }
              >
                <button
                  ref={refDropDownToggle2}
                  className="dropdown-toggle btn btn-primary option-btn-primary"
                  onClick={() => setDropDownToggle2(!dropDownToggle2)}
                >
                  <BsThreeDotsVertical className="mr-2" />
                  Option
                </button>
                <div
                  className="dropdown-menu dropdown-design"
                  aria-labelledby="dropdownMenuLink"
                >
                  <button className="dropdown-item flex-space-between">
                    <span>Select</span>
                  </button>
                  {/* <button className="dropdown-item flex-space-between">
                    <span>Delete</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*medium-active, large-active */}
        <div
          className={
            tabType === 'lg'
              ? 'media-box-wrap'
              : tabType === 'md'
              ? 'media-box-wrap media-size-tab-2'
              : 'media-box-wrap media-size-tab-3'
          }
        >
          <div className="media-box-content mt-5">
            {!isLoaded ? (
              <div className="blog-image-wrap">
                <MediaSkeletonComponent keys={[1, 2, 3, 4, 5]} />
              </div>
            ) : (
              <MediaListingComponent
                job={job}
                parsedMedias={parsedMedias}
                groupOptions={groupOptions}
                setGroupOptions={setGroupOptions}
                selectedMedias={selectedMedias}
                setSelectedMedias={setSelectedMedias}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
