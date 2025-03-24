import { useState, useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { ListSMIcon, ListMDIcon, ListLGIcon } from '../../../components/Icons';

import { IMediaKind, IMediaPopulatedTypes } from '../../Medias/interfaces';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import { MediaSkeletonComponent } from '../skeletons';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';

import { MediaListingComponent } from './Common';

export default function TabDocument({
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

  const refDropDownToggle = useRef<HTMLButtonElement>(null);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropDownToggle, setDropDownToggle] = useState(false);

  //  Dynamic Data
  const [groupBy, setGroupBy] = useState<'date' | 'contributor'>('date');
  const [medias, setMedias] = useState<IMediaPopulatedTypes[]>([]);

  const [parsedMedias, setParsedMedias] = useState<
    interfaces.IJobDetailsTabMediaList[]
  >([]);

  ///  This is for various options in the group like: sorting, selecting
  const [groupOptions, setGroupOptions] =
    useState<interfaces.IJobDetailsTabMediaGroupOptions>({});

  const checkOutside = (event: Event) => {
    if (!isMounted()) {
      return;
    }

    if (!refDropDownToggle?.current?.contains(event.target as Node)) {
      setDropDownToggle(false);
    }
  };

  const fetchData = async () => {
    try {
      const result = await services.jobMediasListService(job.id, {
        kind: IMediaKind.JobDoc,
        userPopulate: true,
      });

      if (!isMounted()) {
        return;
      }
      setIsLoaded(true);
      setMedias(result);

      //  Updating parent Job Document Count
      setJob({
        ...job,
        details: {
          ...job.details,
          mediaDocsCount: result.length,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    document.querySelector('body')!.addEventListener('click', checkOutside);

    //  Only Loading the Docs if have permissions
    if (
      !!(
        userJobPerm.documents &
        (CommonPerms.all | CommonPerms.view | CommonPerms.edit)
      )
    ) {
      fetchData();
    }

    return () => {
      window.removeEventListener('resize', checkOutside);
    };
  }, []);

  //  Updating the grouping of Docs on every change in: GroupBy, Group Options
  useEffect(() => {
    if (!medias.length) {
      return;
    }

    const newParsedMedias = utils.parseJobDetailsTabMedias(
      groupBy,
      groupOptions,
      {},
      medias
    );

    setParsedMedias(newParsedMedias);
  }, [groupBy, groupOptions, medias]);

  return (
    <div
      className="tab-pane fade show active"
      role="tabpanel"
      aria-labelledby="pills-document-tab"
    >
      <div className="main-heading-wrap flex-space-between mb-4">
        <div>
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
        <div className="flex-content">
          <div
            className={
              dropdown2
                ? 'dropdown pr-md-4 pr-0 profile-dropdown dropdown-open'
                : 'dropdown pr-md-4 pr-0 profile-dropdown'
            }
          >
            <button
              className="dropdown-toggle btn btn-primary"
              onClick={() => setDropdown2(!dropdown2)}
            >
              {groupBy === 'date' ? 'By Date' : 'By Contributor'}
            </button>
            <div
              className="dropdown-menu right-res-date"
              aria-labelledby="dropdownMenuLink"
            >
              <button
                className="dropdown-item flex-space-between"
                onClick={() => {
                  if (groupBy === 'date') {
                    return;
                  }
                  setGroupBy('date');
                  setDropdown2(!dropdown2);
                }}
              >
                <span>By Date</span>
                {groupBy === 'date' && <FaCheck />}
              </button>
              <button
                className="dropdown-item flex-space-between"
                onClick={() => {
                  if (groupBy === 'contributor') {
                    return;
                  }
                  setGroupBy('contributor');
                  setDropdown2(!dropdown2);
                }}
              >
                <span>By Contributor</span>
                {groupBy === 'contributor' && <FaCheck />}
              </button>
            </div>
          </div>
          <div className="btn-wrap mobile-d-none">
            <div
              className={
                dropDownToggle
                  ? 'dropdown profile-dropdown dropdown-open'
                  : 'dropdown profile-dropdown'
              }
            >
              <button
                ref={refDropDownToggle}
                className="dropdown-toggle btn btn-primary option-btn-primary"
                onClick={() => setDropDownToggle(!dropDownToggle)}
              >
                <i className="fas fa-ellipsis-v pr-sm-3" />
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
      <div
        className={
          tabType === 'lg'
            ? 'media-box-wrap'
            : tabType === 'md'
            ? 'media-box-wrap media-size-tab-2'
            : 'media-box-wrap media-size-tab-3'
        }
      >
        <div className="media-box-content">
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
              selectedMedias={{}}
              setSelectedMedias={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
