import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';
import {
  FaSortAmountUp,
  FaSortAmountDown,
  FaThLarge,
  FaRegListAlt,
} from 'react-icons/fa';

import { ICommonSort } from '../../../interfaces';
import { CommonPerms, DummyPhotoBase64 } from '../../../constants';

import { toLocaleDateString } from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';

import { IsFetching } from '../../../components/Common';
import Main from '../../../components/Layouts/Main';
import { TextInputComp } from '../../../components/Forms';
import {
  Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';
import { PolyfillAddIcon, DirectionIcon } from '../../../components/Icons';

import {
  IJobPhotoAddHistoryState,
  IJobVideoAddHistoryState,
} from '../../Medias/interfaces';
import { mediaPathsGenerator } from '../../Medias/utils';

import Contributors from '../Common/Contributors';

import JobRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';

export default function JobList() {
  const isMounted = useMountedState();

  const history = useHistory();

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [isFetching, setIsFetching] = useState(false);

  const [mediaCounts, setMediaCounts] = useState({
    photos: 0,
    videos: 0,
    docs: 0,
  });
  const [totalRows, setTotalRows] = useState(1);
  const [data, setData] = useState<interfaces.IJobPopulated[]>([]);

  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  //  Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [sort, setSort] = useState<ICommonSort>({
    title: 1,
    // startDt: 1,
    // endDt: 1,
    // 'address.formatted': 1,
  });

  const [sortKey, setSortKey] = useState<'title' | 'endDt'>('title');

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const result = await services.jobsListService({
        skip: (page - 1) * perPage,
        limit: perPage,
        sort,
        search: searchFilter,
      });
      if (!isMounted()) {
        return;
      }

      //  Format and add the jobs data
      const formattedJobs = result.list.map((job) =>
        utils.parsePopulatedJob(job, {
          userId: authUser.id,
          baseUserType: authUser.userType,
          accountUserType: authUser.accounts[accountIndex].userType,
        })
      );

      setIsFetching(false);
      setData(formattedJobs);
      setTotalRows(result.count);
      updateMediaCounts(formattedJobs);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  const updateMediaCounts = (jobs: interfaces.IJobPopulated[]) => {
    let photosCount = 0;
    let videosCount = 0;
    let docsCount = 0;

    jobs.forEach((job) => {
      const { mediaPhotos, mediaDocs, mediaVideos } = utils.groupJobMedias(
        job.medias
      );

      photosCount += mediaPhotos.length;
      videosCount += mediaVideos.length;
      docsCount += mediaDocs.length;

      //  Updating the total Medias Count on last index loop, This Count is shown in the mobile View only
      setMediaCounts({
        photos: photosCount,
        videos: videosCount,
        docs: docsCount,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, [sort, searchFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const RowsComponent = () => {
    return (
      <>
        {data.map((job) => {
          const { id, title, googlePath, address, endDt, medias } = job;

          const { mediaPhotos } = utils.groupJobMedias(medias);

          const { photoAddPath, videoAddPath } = mediaPathsGenerator(id);

          //  Photo, Video Add History Params
          const photoAddHistoryState: IJobPhotoAddHistoryState = { job };
          const videoAddHistoryState: IJobVideoAddHistoryState = { job };

          return (
            <tr key={id}>
              <td className="text-bold">
                <div className="flex-content profile-name">
                  {!!mediaPhotos.length ? (
                    <img
                      src={mediaPhotos[0].medias[0].mediaURL}
                      alt={mediaPhotos[0].medias[0].name}
                      title={mediaPhotos[0].medias[0].name}
                      onClick={() => {
                        const { photoDetailsPath } = mediaPathsGenerator(
                          job.id,
                          mediaPhotos[0].id
                        );

                        const historyState: interfaces.IJobPhotoDetailsHistoryState =
                          {
                            job,
                            selectedSubMediaId: mediaPhotos[0].medias[0].id,
                            mediaSubKind: mediaPhotos[0].subKind,
                          };

                        history.push(photoDetailsPath, historyState);
                      }}
                    />
                  ) : (
                    <img
                      src={DummyPhotoBase64}
                      alt={'No Photo'}
                      title={'No Photo'}
                    />
                  )}

                  <div className="text-field-content">
                    <h6 className="mb-1 ">
                      <Link
                        to={utils.generateJobDetailsPath(id)}
                        className="text-dark "
                      >
                        <b>{title}</b>
                      </Link>
                    </h6>
                    <span>
                      {mediaPhotos?.length}{' '}
                      {mediaPhotos.length <= 1 ? 'Photo' : 'Photos'}
                      <span className="dot" />
                      {toLocaleDateString(endDt)}
                    </span>
                  </div>
                </div>
              </td>
              <td
                className="address-field"
                onClick={() => window.open(googlePath, '_blank')}
              >
                <div className="d-flex justify-content-between fz-14-12">
                  {address.formatted}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="d-block d-md-none"
                    href={googlePath}
                  >
                    <DirectionIcon />
                  </a>
                </div>
              </td>
              <td className="contributers-wrap">
                <h2 className="d-md-none mobile-heading">Contributors</h2>
                <div className="flex-content mb-sm-2">
                  {!!job.contributors?.length && (
                    <Contributors
                      contributors={job.contributors}
                      mostContributorIndex={job.mostContributorIndex}
                      mostRecentContributorIndex={
                        job.mostRecentContributorIndex
                      }
                    />
                  )}
                </div>
              </td>
              <td className="photo-img-wrap">
                <h2 className="d-md-none mobile-heading">
                  Photos ({mediaPhotos.length})
                </h2>
                <div className="photo-wrap flex-content">
                  {/* Only 3 Photos are shown */}
                  {mediaPhotos.slice(0, 3).map((mediaPhoto) => {
                    const subMedia = mediaPhoto.medias[0];

                    const { photoDetailsPath } = mediaPathsGenerator(
                      job.id,
                      mediaPhoto.id
                    );

                    const historyState: interfaces.IJobPhotoDetailsHistoryState =
                      {
                        job,
                        selectedSubMediaId: subMedia.id,
                        mediaSubKind: mediaPhoto.subKind,
                      };

                    return (
                      <img
                        className="mr-2"
                        src={subMedia.mediaURL}
                        alt={subMedia.name}
                        title={subMedia.name}
                        key={subMedia.id}
                        onClick={() => {
                          history.push(photoDetailsPath, historyState);
                        }}
                      />
                    );
                  })}
                </div>
              </td>
              <td>
                <div className="icon-list flex-content">
                  <div className="btn-group">
                    <a
                      href="/#"
                      className="mr-2"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="32"
                          height="32"
                          rx="4"
                          fill="var(--primary)"
                        />
                        <g clipPath="url(#clip0_5813_2858)">
                          <path
                            d="M21.1875 9H20.7748L19.0003 6.699C18.7716 6.40472 18.4789 6.16634 18.1444 6.00192C17.8099 5.8375 17.4424 5.75135 17.0697 5.75H13.9303C13.5576 5.75135 13.1901 5.8375 12.8556 6.00192C12.5211 6.16634 12.2284 6.40472 11.9998 6.699L10.2252 9H9.8125C8.73545 9.00129 7.70289 9.42972 6.9413 10.1913C6.17972 10.9529 5.75129 11.9855 5.75 13.0625L5.75 21.1875C5.75129 22.2645 6.17972 23.2971 6.9413 24.0587C7.70289 24.8203 8.73545 25.2487 9.8125 25.25H21.1875C22.2645 25.2487 23.2971 24.8203 24.0587 24.0587C24.8203 23.2971 25.2487 22.2645 25.25 21.1875V13.0625C25.2487 11.9855 24.8203 10.9529 24.0587 10.1913C23.2971 9.42972 22.2645 9.00129 21.1875 9ZM13.2867 7.69188C13.3629 7.59361 13.4604 7.51399 13.5719 7.45908C13.6834 7.40417 13.806 7.37541 13.9303 7.375H17.0697C17.194 7.37553 17.3165 7.40434 17.428 7.45924C17.5395 7.51414 17.6371 7.5937 17.7133 7.69188L18.7224 9H12.2776L13.2867 7.69188ZM23.625 21.1875C23.625 21.834 23.3682 22.454 22.9111 22.9111C22.454 23.3682 21.834 23.625 21.1875 23.625H9.8125C9.16603 23.625 8.54605 23.3682 8.08893 22.9111C7.63181 22.454 7.375 21.834 7.375 21.1875V13.0625C7.375 12.416 7.63181 11.796 8.08893 11.3389C8.54605 10.8818 9.16603 10.625 9.8125 10.625H21.1875C21.834 10.625 22.454 10.8818 22.9111 11.3389C23.3682 11.796 23.625 12.416 23.625 13.0625V21.1875Z"
                            fill="white"
                          />
                          <path
                            d="M15.5 12.25C14.5358 12.25 13.5933 12.5359 12.7916 13.0716C11.9899 13.6073 11.3651 14.3686 10.9961 15.2594C10.6271 16.1502 10.5306 17.1304 10.7187 18.0761C10.9068 19.0217 11.3711 19.8904 12.0529 20.5721C12.7346 21.2539 13.6033 21.7182 14.5489 21.9063C15.4946 22.0944 16.4748 21.9979 17.3656 21.6289C18.2564 21.2599 19.0177 20.6351 19.5534 19.8334C20.0891 19.0317 20.375 18.0892 20.375 17.125C20.3737 15.8325 19.8597 14.5932 18.9457 13.6793C18.0318 12.7653 16.7925 12.2513 15.5 12.25ZM15.5 20.375C14.8572 20.375 14.2289 20.1844 13.6944 19.8273C13.1599 19.4702 12.7434 18.9626 12.4974 18.3687C12.2514 17.7749 12.187 17.1214 12.3124 16.491C12.4379 15.8605 12.7474 15.2814 13.2019 14.8269C13.6564 14.3724 14.2355 14.0628 14.866 13.9374C15.4964 13.812 16.1499 13.8764 16.7437 14.1224C17.3376 14.3684 17.8452 14.7849 18.2023 15.3194C18.5594 15.8539 18.75 16.4822 18.75 17.125C18.75 17.987 18.4076 18.8136 17.7981 19.4231C17.1886 20.0326 16.362 20.375 15.5 20.375Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5813_2858">
                            <rect
                              width="19.5"
                              height="19.5"
                              fill="white"
                              transform="translate(5.75 5.75)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                    <ul className="dropdown-menu p-3 dropdown-menu-right border-0 shadow-sm">
                      {!!(
                        job.currentUserJobPerm.permissions.mediaPhotos &
                        (CommonPerms.all | CommonPerms.add)
                      ) && (
                        <Fragment>
                          <li>
                            <Link
                              to={{
                                pathname: photoAddPath,
                                state: photoAddHistoryState,
                              }}
                            >
                              <button
                                className="dropdown-item fs-13"
                                type="button"
                              >
                                New Photo
                              </button>
                            </Link>
                          </li>
                          <li className="dropdown-divider" />
                        </Fragment>
                      )}

                      {!!(
                        job.currentUserJobPerm.permissions.mediaVideos &
                        (CommonPerms.all | CommonPerms.add)
                      ) && (
                        <li>
                          <Link
                            to={{
                              pathname: videoAddPath,
                              state: videoAddHistoryState,
                            }}
                          >
                            <button
                              className="dropdown-item fs-13"
                              type="button"
                            >
                              New Video
                            </button>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                  <a
                    target="_blank"
                    className="d-none d-md-block"
                    rel="noreferrer"
                    href={googlePath}
                  >
                    <DirectionIcon />
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <Main sideBarId={JobRoutes.routes.list.sideBarId}>
      {isFetching && <IsFetching />}

      <div className={viewType === 'list' ? 'list-in mx-2' : 'grid-in mx-2'}>
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">{JobRoutes.name}</h5>
            <div className="btn-wrap ml-auto d-lg-none mobile-d-none">
              {JobRoutes.routes.add.access && (
                <Link
                  className="btn btn-primary"
                  to={JobRoutes.routes.add.path}
                  title="New Job"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add New
                </Link>
              )}
            </div>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <div className="grid-list-icon flex-content pr-3 d-none d-md-inline desktop-grid">
              <button
                className={`pr-2 list-content ${
                  viewType === 'list'
                    ? 'grid-active border-0 bg-transparent'
                    : 'border-0 bg-transparent'
                }`}
                onClick={() => {
                  if (viewType === 'grid') {
                    setViewType('list');
                  }
                }}
              >
                <FaRegListAlt className="fa-2x" />
              </button>
              <button
                className={`${
                  viewType === 'grid'
                    ? 'grid-active border-0 bg-transparent'
                    : 'border-0 bg-transparent'
                }`}
                onClick={() => {
                  if (viewType === 'list') {
                    setViewType('grid');
                  }
                }}
              >
                <FaThLarge className="fa-2x" />
              </button>
            </div>
            <form
              className="d-none d-md-inline ml-auto"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="form-group ipad-mr-0">
                <TextInputComp
                  name="searchFilter"
                  type="text"
                  className="form-control"
                  placeholder="Search Jobs"
                  onChange={setSearchFilter}
                  value={searchFilter}
                />
                <i className="fas fa-search" />
              </div>
            </form>
            {JobRoutes.routes.add.access && (
              <div className="btn-wrap ipad-d-none">
                <Link
                  className="btn btn-primary"
                  to={JobRoutes.routes.add.path}
                  title="New Job"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add New
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-job-list-btn mb-2">
          <div className="row">
            <div className="col-6 col-sm-6">
              <div className="flex-content card-box normal-line-height">
                <div className="card-image">
                  <svg
                    width="27"
                    height="26"
                    viewBox="0 0 27 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.5113 5.46316H18.1244V3.06812C18.1244 1.92772 17.2835 1 16.2499 1H10.75C9.71645 1 8.87559 1.92772 8.87559 3.06812V5.46316H3.48874C2.11642 5.46316 1 6.69503 1 8.20915V22.2541C1 23.7682 2.11642 25 3.48874 25H23.5113C24.8835 25 26 23.7682 26 22.2541V8.20915C26 6.69503 24.8835 5.46316 23.5113 5.46316ZM10.4632 3.06812C10.4632 2.89365 10.5919 2.75176 10.75 2.75176H16.2499C16.4081 2.75176 16.5367 2.89371 16.5367 3.06812V5.46316H10.4632V3.06812ZM2.58765 8.20915C2.58765 7.66091 2.99186 7.21492 3.48874 7.21492H23.5113C24.0081 7.21492 24.4123 7.66091 24.4123 8.20915V9.50551C24.4123 10.7215 23.6734 11.808 22.6153 12.1479L14.3127 14.8152C13.781 14.986 13.219 14.986 12.6873 14.8152L4.38467 12.1479C3.3266 11.808 2.58765 10.7215 2.58765 9.50551V8.20915ZM23.5113 23.2483H3.48874C2.99191 23.2483 2.58765 22.8023 2.58765 22.2541V13.0719C2.98769 13.4131 3.44369 13.6701 3.94083 13.8298C13.1124 16.7762 12.6411 16.6951 13.5 16.6951C14.3703 16.6951 13.8768 16.7796 23.0591 13.8298C23.5563 13.6701 24.0123 13.4131 24.4123 13.0719V22.2541C24.4123 22.8023 24.0081 23.2483 23.5113 23.2483Z"
                      fill="var(--primary)"
                      stroke="var(--primary)"
                      strokeWidth="0.4"
                    />
                  </svg>
                </div>
                <div className="card-content pl-3">
                  <p className="sec-content fz-12">Jobs</p>
                  <span className="number-text fz-14 color-primary ">
                    {' '}
                    <b>{totalRows}</b>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6">
              <div className="flex-content card-box normal-line-height">
                <div className="card-image">
                  <svg
                    width="26"
                    height="24"
                    viewBox="0 0 26 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_358_1612)">
                      <path
                        d="M20.0647 8.29688C19.5253 8.29688 19.0881 8.71659 19.0881 9.23438C19.0881 9.75216 19.5253 10.1719 20.0647 10.1719H21.0901C21.6294 10.1719 22.0667 9.75216 22.0667 9.23438C22.0667 8.71659 21.6294 8.29688 21.0901 8.29688H20.0647Z"
                        fill="var(--primary)"
                        stroke="var(--primary)"
                        strokeOpacity="0.1"
                        strokeWidth="0.2"
                      />
                      <path
                        d="M24.9963 15.3281C25.5357 15.3281 25.9729 14.9084 25.9729 14.3906V8.29688C25.9729 6.22913 24.2206 4.54688 22.0667 4.54688H19.1193C18.7011 4.54688 18.3296 4.2915 18.1949 3.91153L17.8994 3.07814C17.4952 1.93795 16.3806 1.17188 15.126 1.17188H8.88716C7.65684 1.17188 6.54946 1.91827 6.13169 3.02906L5.79355 3.9278C5.6543 4.29811 5.28516 4.54688 4.87505 4.54688C4.87368 4.54688 4.87231 4.54692 4.8709 4.54688C2.7208 4.55119 0.9729 6.23175 0.9729 8.29688V19.0781C0.9729 21.1459 2.72524 22.8281 4.87915 22.8281H22.0667C24.2206 22.8281 25.9729 21.1459 25.9729 19.0781C25.9729 18.5603 25.5357 18.1406 24.9963 18.1406C24.457 18.1406 24.0198 18.5603 24.0198 19.0781C24.0198 20.112 23.1436 20.9531 22.0667 20.9531H4.87915C3.8022 20.9531 2.92603 20.112 2.92603 19.0781V8.29688C2.92603 7.263 3.8022 6.42188 4.87915 6.42188C4.88115 6.42192 4.88301 6.42192 4.88496 6.42188C6.11133 6.41789 7.21382 5.67253 7.63052 4.56469L7.96865 3.66595C8.10791 3.29564 8.47705 3.04688 8.88716 3.04688H15.1259C15.5441 3.04688 15.9156 3.3022 16.0504 3.68222L16.3459 4.51566C16.7502 5.65584 17.8648 6.42188 19.1193 6.42188H22.0667C23.1436 6.42188 24.0198 7.263 24.0198 8.29688V14.3906C24.0198 14.9084 24.457 15.3281 24.9963 15.3281Z"
                        fill="var(--primary)"
                        stroke="var(--primary)"
                        strokeOpacity="0.1"
                        strokeWidth="0.2"
                      />
                      <path
                        d="M11.8127 7.35938C8.44727 7.35938 5.70923 9.98789 5.70923 13.2188C5.70923 16.4496 8.44727 19.0781 11.8127 19.0781C15.1782 19.0781 17.9163 16.4496 17.9163 13.2188C17.9163 9.98789 15.1782 7.35938 11.8127 7.35938ZM11.8127 17.2031C9.52422 17.2031 7.66235 15.4157 7.66235 13.2188C7.66235 11.0218 9.52422 9.23438 11.8127 9.23438C14.1013 9.23438 15.9631 11.0218 15.9631 13.2188C15.9631 15.4157 14.1013 17.2031 11.8127 17.2031Z"
                        fill="var(--primary)"
                        stroke="var(--primary)"
                        strokeOpacity="0.1"
                        strokeWidth="0.2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_358_1612">
                        <rect
                          width="25"
                          height="24"
                          fill="white"
                          transform="translate(0.9729)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="card-content pl-3">
                  <p className="sec-content fz-12">Photos</p>
                  <span className="number-text color-primary">
                    <b>{mediaCounts.photos}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-list-icon d-md-none d-flex w-100 job-mobile-icon">
          <div className="pull-left">
            <select
              className="form-control"
              value={sortKey}
              onChange={(event) => {
                const value = event.target.value;
                //@ts-ignore
                setSortKey(value);

                setSort({
                  [value]: sort[value] || 1,
                });
              }}
            >
              <option value="title">Title</option>
              <option value="endDt">Due Date</option>
            </select>
          </div>

          <div className="grid-list-icon flex-content ml-auto primary-icon">
            <button
              className={`pr-2 list-content ${
                viewType === 'list'
                  ? 'active-icon border-0 bg-transparent'
                  : 'border-0 bg-transparent'
              }`}
              onClick={() => {
                if (viewType === 'grid') {
                  setViewType('list');
                }
              }}
            >
              <FaRegListAlt className="fa-2x" />
            </button>
            <button
              className={`${
                viewType === 'grid'
                  ? 'active-icon border-0 bg-transparent'
                  : 'border-0 bg-transparent'
              }`}
              onClick={() => {
                if (viewType === 'list') {
                  setViewType('grid');
                }
              }}
            >
              <FaThLarge className="fa-2x" />
            </button>
            <button
              className={
                sort[sortKey] === 1
                  ? `active-icon down-sort border-0 bg-transparent`
                  : 'down-sort border-0 bg-transparent'
              }
              onClick={() => {
                setSort({
                  ...sort,
                  [sortKey]: 1,
                });
              }}
            >
              <FaSortAmountDown />
            </button>
            <button
              className={
                sort[sortKey] === -1
                  ? `active-icon down-sort border-0 bg-transparent`
                  : 'down-sort border-0 bg-transparent'
              }
              onClick={() => {
                setSort({
                  ...sort,
                  [sortKey]: -1,
                });
              }}
            >
              <FaSortAmountUp />
            </button>
          </div>
        </div>

        <div className="user-table-wrap job-table-wrap jobs-grid-table mobile-table">
          <div className="table-wrap">
            <table className="table">
              <thead className="mobile-d-none">
                <tr>
                  <th scope="col">
                    <div
                      className="flex-content"
                      onClick={() => {
                        setSortKey('title');

                        setSort({
                          // ...sort,
                          title: sort.title === 1 ? -1 : 1,
                        });
                      }}
                    >
                      Name{'   '}
                      {sort.title === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown className="ml-2" />
                      )}
                    </div>
                  </th>
                  <th scope="col">
                    <div
                      className="flex-content"
                      // onClick={() => {
                      //   setSort({
                      //     ...sort,
                      //     'address.formatted':
                      //       sort['address.formatted'] === 1 ? -1 : 1,
                      //   });
                      // }}
                    >
                      Address{' '}
                      {/* {sort['address.formatted'] === 1 ? (
                        <FaSortAmountUp />
                      ) : (
                        <FaSortAmountDown />
                      )} */}
                    </div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Contributors</div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Photos</div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>{!isFetching && <RowsComponent />}</tbody>
            </table>

            {!isFetching && (
              <Pagination
                totalRows={totalRows}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}
