import { useEffect, useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation, useHistory, Link } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { FiChevronDown } from 'react-icons/fi';
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from 'react-icons/fa';

import { CommonPerms } from '../../../constants';
import { Modal } from 'react-bootstrap';


import {
  generateDynamicPath,
  toLocaleDateString,
  toLocaleDTString,
} from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';
import { TextInputComp } from '../../../components/Forms';
import { Popup } from '../../../components/Common';
import {
  PolyfillAddIcon,
  DirectionIcon,
  ListLGIcon,
  ListMDIcon,
  PropertiesIcon,
} from '../../../components/Icons';

import Main from '../../../components/Layouts/Main';

import { formatUserName } from '../../Users/utils';
import { DefaultUserPic } from '../../Users/constants';

import {
  IMediaKind,
  IJobPhotoAddHistoryState,
  IJobVideoAddHistoryState,
} from '../../Medias/interfaces';
import { mediaPathsGenerator } from '../../Medias/utils';

import Contributors from '../Common/Contributors';
import { CameraIcon, StarIcon } from '../Icons';

import JobRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';

import TabMedia from './TabMedia';
import TabDocument from './TabDocument';
import TabConversation from './TabConversation';
import TabNotepad from './TabNotepad';
import TabComments from './TabComments';
import TabTimeline from './TabTimeline';
import TabBills from './TabBills';
import MyModal from './WoModal';
import Stripe from '../../../components/Stripe'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
export default function JobDetails() {
  
  
  const isMounted = useMountedState();

  const params: { jobId: string } = useParams();
  const { hash } = useLocation();
  const history = useHistory();

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [job, setJob] = useState<interfaces.IJobPopulated>(
    utils.generateDefaultJob(authUser, accountIndex, params.jobId)
  );

  const [paths] = useState({
    membersEdit: generateDynamicPath(JobRoutes.routes.membersEdit.path, {
      jobId: params.jobId,
    }),
    infoEdit: generateDynamicPath(JobRoutes.routes.infoEdit.path, {
      jobId: params.jobId,
    }),
    ...mediaPathsGenerator(job.id),
  });

  const [contributorsPopup, setContributorsPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [selectedTab, setSelectedTab] = useState<
    string | interfaces.IJobDetailTabTypes
  >(hash?.substring(1) || 'pills-home');
  const [tabPerms, setTabPerms] = useState({
    media: false,
    documents: false,
    conversations: false,
    comments: false,
    notes: false,
    timeline: false,
    bills: false
  });

  const [searchFilter, setSearchFilter] = useState('');

  const [dropDownToggle2, setDropDownToggle2] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropDownMedia, setDropDownMedia] = useState(false);
  const refMedia = useRef<HTMLButtonElement>(null);
  const refDropDown = useRef<HTMLButtonElement>(null);
  const refDropDownToggle = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [fullJob, setFullJob] = useState();
  const fetchData = async () => {
    try {
      const job = await services.jobDetailService(params.jobId, {
        userPopulate: true,
        mediaPopulate: true,
      });
      setFullJob(job);
      if (!isMounted()) {
        return;
      }

      const formatedJob = utils.parsePopulatedJob(job, {
        userId: authUser.id,
        baseUserType: authUser.userType,
        accountUserType: authUser.accounts[accountIndex].userType,
      });

      const { permissions } = formatedJob.currentUserJobPerm;
      const newTabPerms = {
        media: !!(
          permissions.mediaPhotos &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        documents: !!(
          permissions.documents &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        conversations: !!(
          permissions.conversations &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        comments: !!(
          permissions.comments &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        notes: !!(
          permissions.notes &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        bills: !!(
          permissions.documents &
          (CommonPerms.all | CommonPerms.add | CommonPerms.view)
        ),
        timeline: true,
      };

      setJob(formatedJob);
      setTabPerms(newTabPerms);

      const switchActiveTab = () => {
        if (newTabPerms.media) {
          setSelectedTab('pills-home');
        } else if (newTabPerms.documents) {
          setSelectedTab('pills-document');
        } else if (newTabPerms.conversations) {
          setSelectedTab('pills-converstation');
        } else if (newTabPerms.notes) {
          setSelectedTab('pills-notpad');
        } else if (newTabPerms.comments) {
          setSelectedTab('pills-comments');
        }else if (newTabPerms.bills) {
          setSelectedTab('pills-bills');
        }
      };

      // Implement Permission based auto selected tab
      if (
        (selectedTab === 'pills-home' && !newTabPerms.media) ||
        (selectedTab === 'pills-document' && !newTabPerms.documents) ||
        (selectedTab === 'pills-converstation' && !newTabPerms.conversations) ||
        (selectedTab === 'pills-notes' && !newTabPerms.notes) ||
        (selectedTab === 'pills-comments' && !newTabPerms.comments) || 
        (selectedTab === 'pills-bills' && !newTabPerms.bills)
      ) {
        switchActiveTab();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkOutside = (event: Event) => {
    if (!isMounted()) {
      return;
    }
    if (!refMedia?.current?.contains(event.target as Node)) {
      setDropDownMedia(false);
    }
    if (!refDropDown?.current?.contains(event.target as Node)) {
      setDropdown2(false);
    }
    if (!refDropDownToggle?.current?.contains(event.target as Node)) {
      setDropDownToggle2(false);
    }
  };

  const handleDocumentSelect = (evt: any) => {
    if (evt.target.files) {
      history.push({
        pathname: generateDynamicPath(JobRoutes.routes.jobDocAdd.path, {
          jobId: params.jobId,
        }),
        state: { documents: evt.target.files },
      });
    }
  };

  const SearchBoxComponent = ({ placeholder }: { placeholder: string }) => {
    const formSubmitted = (event: React.ChangeEvent<any>) => {
      event.preventDefault();
    };

    return (
      <form
        className="d-none d-md-inline ml-auto tab-search-form"
        onSubmit={formSubmitted}
      >
        <div className="form-group mr-md-0">
          <TextInputComp
            name="searchFilter"
            type="text"
            className="form-control"
            placeholder={placeholder}
            onChange={setSearchFilter}
            value={searchFilter}
          />
          <i className="fas fa-search" />
        </div>
      </form>
    );
  };

  const tabLinks = () => {
    return (
      <div className="flex-space-between mb-4 auto-overflow">
        <ul
          className="nav nav-pills mb-md-0 mb-3"
          id="pills-tab"
          role="tablist"
        >
          {tabPerms.media && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-home' ? 'nav-link active' : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-home');

                  window.history.pushState('', '', '#pills-home');
                }}
                data-toggle="pill"
                href="#pills-home"
                role="tab"
                aria-controls="pills-home"
                aria-selected={selectedTab === 'pills-home' ? 'true' : 'false'}
              >
                MEDIA (
                {job.details.mediaPhotosCount + job.details.mediaVideosCount})
              </a>
            </li>
          )}

          {tabPerms.documents && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-document'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-document');

                  window.history.pushState('', '', '#pills-document');
                }}
                data-toggle="pill"
                href="#pills-document"
                role="tab"
                aria-controls="pills-document"
                aria-selected={
                  selectedTab === 'pills-document' ? 'true' : 'false'
                }
              >
                DOCUMENTS ({job.details.mediaDocsCount})
              </a>
            </li>
          )}
          {tabPerms.bills && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-bills'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-bills');

                  window.history.pushState('', '', '#pills-bills');
                }}
                data-toggle="pill"
                href="#pills-bills"
                role="tab"
                aria-controls="pills-bills"
                aria-selected={
                  selectedTab === 'pills-bills' ? 'true' : 'false'
                }
              >
                BILLS ({job.details.billCount})
              </a>
            </li>
          )}
          {tabPerms.conversations && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-converstation'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-converstation');

                  window.history.pushState('', '', '#pills-converstation');
                }}
                id="pills-converstation-tab"
                data-toggle="pill"
                href="#pills-converstation"
                role="tab"
                aria-controls="pills-converstation"
                aria-selected="false"
              >
                CONVERSATION ({job.details.conversationCount})
              </a>
            </li>
          )}

          {tabPerms.notes && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-notpad'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-notpad');

                  window.history.pushState('', '', '#pills-notpad');
                }}
                id="pills-notpad-tab"
                data-toggle="pill"
                href="#pills-notpad"
                role="tab"
                aria-controls="pills-notpad"
                aria-selected="false"
              >
                NOTEPAD ({job.details.notesCount})
              </a>
            </li>
          )}

          {tabPerms.comments && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-comments'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-comments');

                  window.history.pushState('', '', '#pills-comments');
                }}
                id="pills-comments-tab"
                data-toggle="pill"
                href="#pills-comments"
                role="tab"
                aria-controls="pills-comments"
                aria-selected="false"
              >
                COMMENTS ({job.details.commentsCount})
              </a>
            </li>
          )}

          {tabPerms.timeline && (
            <li className="nav-item">
              <a
                className={
                  selectedTab === 'pills-timeline'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                onClick={() => {
                  setSelectedTab('pills-timeline');

                  window.history.pushState('', '', '#pills-timeline');
                }}
                id="pills-timeline-tab"
                data-toggle="pill"
                href="#pills-timeline"
                role="tab"
                aria-controls="pills-timeline"
                aria-selected="false"
              >
                TIMELINE
              </a>
            </li>
          )}
        </ul>

        {selectedTab === 'pills-home' && tabPerms.media && !!job && (
          <>
            <div className="btn-wrap flex-content d-none d-md-block">
              <div
                className={
                  dropDownMedia
                    ? 'dropdown profile-dropdown dropdown-open'
                    : 'dropdown profile-dropdown'
                }
              >
                <button
                  ref={refMedia}
                  className="dropdown-toggle btn btn-primary option-btn-primary flex-content"
                  onClick={() => setDropDownMedia(!dropDownMedia)}
                  title="New Media"
                >
                  <PolyfillAddIcon className="mr-2" />
                  New Media
                </button>
                <div
                  className="dropdown-menu dropdown-design"
                  aria-labelledby="dropdownMenuLink"
                >
                  {!!(
                    job.currentUserJobPerm.permissions.mediaPhotos &
                    (CommonPerms.all | CommonPerms.add)
                  ) && (
                    <Link
                      className="dropdown-item flex-space-between"
                      to={{
                        pathname: paths.photoAddPath,
                        state: { ...job } as IJobPhotoAddHistoryState,
                      }}
                    >
                      <span>New Photo</span>
                    </Link>
                  )}

                  {!!(
                    job.currentUserJobPerm.permissions.mediaVideos &
                    (CommonPerms.all | CommonPerms.add)
                  ) && (
                    <Link
                      className="dropdown-item flex-space-between"
                      to={{
                        pathname: paths.videoAddPath,
                        state: { ...job } as IJobVideoAddHistoryState,
                      }}
                    >
                      <span>New Video</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'pills-document' && tabPerms.documents && !!job && (
          <>
            <div className="btn-wrap flex-content d-none d-md-block">
              <label
                htmlFor="documentfile"
                className="btn btn-primary flex-content c-pointer"
                title="New Document"
              >
                <PolyfillAddIcon className="mr-2" />
                New Document
                <input
                  type="file"
                  onChange={handleDocumentSelect}
                  accept="application/pdf"
                  id="documentfile"
                  className="d-none"
                  multiple
                />
              </label>
            </div>
          </>
        )}

        {selectedTab === 'pills-converstation' &&
          tabPerms.conversations &&
          !!job && <SearchBoxComponent placeholder="Search Conversations" />}

        {selectedTab === 'pills-notpad' && tabPerms.notes && !!job && (
          <SearchBoxComponent placeholder="Search Notes" />
        )}

        {selectedTab === 'pills-comments' && tabPerms.comments && !!job && (
          <SearchBoxComponent placeholder="Search Comments" />
        )}

        {selectedTab === 'pills-timeline' && tabPerms.timeline && !!job && (
          <>
            <div
              className={
                dropdown2
                  ? 'dropdown pr-md-4 pr-0 d-none d-md-inline profile-dropdown timeline-tab dropdown-open'
                  : 'dropdown pr-md-4 pr-0 d-none d-md-inline profile-dropdown'
              }
            >
              <button
                // ref={refDropDown}
                onClick={(e) => setFilterPopup(true)}
                className=" dropdown-toggle dropdown-link btn btn-primary primary-svg"
                // onClick={() => setDropdown2(!dropdown2)}
              >
                <span className="fz-18">
                  Filters <FiChevronDown />
                </span>
              </button>

              <FaSortAmountUpAlt
                className={`fas fa-sort-amount-up fz-16 mr-3 ${
                  sortOrder === 'desc' ? 'text-muted' : ''
                } `}
                onClick={() => {
                  setSortOrder('asc');
                }}
              />

              <FaSortAmountDownAlt
                className={`fas fa-sort-amount-down fz-16 mr-3 ${
                  sortOrder === 'asc' ? 'text-muted' : ''
                } `}
                onClick={() => {
                  setSortOrder('desc');
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const { permissions } = job.currentUserJobPerm;

  // useEffect(() => {
  //   if (hash && isMounted()) {
  //     const tab = hash.substring(1);

  //     if (tab && tab !== selectedTab && isMounted()) {
  //       setSelectedTab(tab);
  //     }
  //   }
  // });

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    const handleResize = () => {
      const myWidth = window.innerWidth;
      myWidth < 766 ? setIsMobile(true) : setIsMobile(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMounted()) {
      return;
    }
    document.querySelector('body')!.addEventListener('click', checkOutside);

    fetchData();
  }, []);

  const JobOptionsComponent = () => {
    return (
      <div
        className={
          dropDownToggle2
            ? 'dropdown profile-dropdown dropdown-open'
            : 'dropdown profile-dropdown'
        }
      >
        <button
          ref={refDropDownToggle}
          className="dropdown-toggle btn btn-primary"
          onClick={() => setDropDownToggle2(!dropDownToggle2)}
        >
          <i className="fas fa-ellipsis-v pr-sm-3" />
          {isMobile ? '' : 'Job Options'}
        </button>
        <div
          className="dropdown-menu dropdown-design"
          aria-labelledby="dropdownMenuLink"
        >
          {!!(
            permissions.members &
            (CommonPerms.all |
              CommonPerms.view |
              CommonPerms.edit |
              CommonPerms.delete)
          ) && (
            <Link
              className="dropdown-item flex-space-between"
              to={paths.membersEdit}
            >
              <span>Edit Members</span>
            </Link>
          )}

          {!job.isDeleted &&
            !!(permissions.base & (CommonPerms.all | CommonPerms.edit)) && (
              <Link
                className="dropdown-item flex-space-between"
                to={paths.infoEdit}
              >
                <span>Edit Job Details</span>
              </Link>
            )}

          {!job.isDeleted &&
            !!(permissions.base & (CommonPerms.all | CommonPerms.delete)) && (
              <button
                className="dropdown-item flex-space-between"
                onClick={() => {
                  setDeletePopup(true);
                }}
              >
                <span>Delete</span>
              </button>
            )}

          {!job.isDeleted && (
            <Link
              className="dropdown-item flex-space-between"
              to={paths.mediasVisibilityPath}
            >
              <span>Media Visibility</span>
            </Link>
          )}
        </div>
      </div>
    );
  };

  const JobWorkOrdersComponent = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
      setModalIsOpen(true);
    };
    const closeModal = () => {
      setModalIsOpen(false);
    };

    return (
      <Fragment>
        <div className="contributor-title">
          <span className="title">Service Order</span>
          <div className="flex-content-workorder">
            <span className="subtitle">#{job.serviceIssues.ServiceManagerIssueID}</span>
              <span className="btn-box workorder-btn"
              onClick={openModal}
              style={{cursor: 'pointer'}}
              >
                <img
                  src={require('../../../assets/images/btn_doc.png').default}
                  alt="Service Work Order List"
                  title="Service Work Order List"
                />
                
            </span>
            <MyModal isOpen={modalIsOpen} closeModal={closeModal} serviceId={job.serviceIssues.ServiceManagerIssueID} jobdetails={fullJob} />
            
          </div>
        </div>
      </Fragment>
    );
  };

  const JobContributorsComponent = () => {
    if (!job.contributors.length) {
      return null;
    }

    return (
      <Fragment>
        <div className="contributor-title">
          <span className="title">Contributors</span>
          <div className="flex-content">
            <Contributors
              contributors={job.contributors}
              mostContributorIndex={job.mostContributorIndex}
              mostRecentContributorIndex={job.mostRecentContributorIndex}
            />
          </div>
        </div>

        {contributorsPopup
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}
        {contributorsPopup ? (
          <Popup
            isOpen={contributorsPopup}
            hideButton={true}
            onClose={() => setContributorsPopup(false)}
            title={'Contributors'}
          >
            <div className="user-table-wrap datamobile-table">
              <div className="table-responsive table-wrap">
                <table className="table">
                  <tbody>
                    {job.contributors.map((contributor, index) => {
                      const { id, firstName, lastName, email, picURL } =
                        contributor.userId;
                      const name = formatUserName(firstName, lastName);
                      const { details } = contributor;

                      return (
                        <tr key={`${id}-${index}`}>
                          <td className="text-bold">
                            <div className="flex-content">
                              <div className="user-icon">
                                <img
                                  src={picURL || DefaultUserPic}
                                  alt={name}
                                  title={name}
                                />
                              </div>
                              <div className="email-table-title">
                                <h6>{name}</h6>
                                <span>{email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="icon-list text-right">
                              <div className="icon mr-0">
                                {details.contributionCount}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Popup>
        ) : (
          <div className="sell-link-wrap">
            <span className="dot mr-1">....</span>
            <span
              className="sell-all-link"
              onClick={() => {
                setContributorsPopup(true);
              }}
            >
              See All
            </span>
          </div>
        )}
      </Fragment>
    );
  };
  const JobDeleteComponent = () => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteJob = async () => {
      try {
        setIsDeleting(true);

        let result = await services.jobDeleteService(params.jobId);

        history.push(JobRoutes.routes.list.path, {
          successMsg: result.message,
        });
      } catch (error) {
        setIsDeleting(false);
      }
    };

    if (!deletePopup) {
      return null;
    }

    return (
      <Fragment>
        {deletePopup
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}

        <Popup
          isOpen={deletePopup}
          title={'Delete Confirmation'}
          hideButton={false}
          onClose={() => setDeletePopup(false)}
          leftItem={'Cancel'}
          leftFunction={() => setDeletePopup(false)}
          onSave={deleteJob}
          ModalName={'Yes'}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isDeleting}
        >
          <div className="sec-content">
            <p>Are you sure you want to delete this job: {job.title}?</p>
          </div>
        </Popup>
      </Fragment>
    );
  };

  const { mediaPhotos } = utils.groupJobMedias(job.medias);
  //testing
  const [showstripe, setShowStripe] = useState(false);
  const [showstripeintent, setShowStripeIntent] = useState('');
  const handleStripeButton = async () =>{    
    try {
      const job = await services.sendStripeRequest("acct_1OgkEe3RoztM006Q", "50", "usd", {}, {}, authUser.primaryUserId);
      console.log(job);
      setShowStripeIntent(job.paymentIntent);
      console.log('Before setShowStripe(true)');
      setShowStripe(true);
      console.log('After setShowStripe(true)');
    } catch (error) {
      console.error("Error sending stripe request:", error);
    }
   
  }

  const secondModalStyle = {
    modalContent: {
      borderRadius: 0, // Set the desired border-radius
    },
    
  };
  return (
    <Main sideBarId={JobRoutes.routes.details.sideBarId}>
      <JobDeleteComponent />
      {/* <PaymentComponent /> */}
        {showstripe && (
          <Modal show={showstripe} onHide={() => setShowStripe(false)} style={secondModalStyle.modalContent}>
            <Modal.Header closeButton>
              <Modal.Title>Stripe Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={secondModalStyle.modalContent}>
              <Stripe showstripeintent={showstripeintent} email={authUser.email} name={authUser.name} />
            </Modal.Body>
          </Modal>
        )}
      <div className="user-heading-wrap plumbing-heading-wrap flex-space-between-start main-heading-wrap px-3" >
        {isMobile ? (
          <div className="d-flex heading-txt align-items-center w-100 pb-3">
            <h2 className="sec-title">Job Details</h2>
            <div className="btn-wrap flex-content d-block order-md-1 ml-auto">
              {JobOptionsComponent()}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="d-block d-md-flex">
          <div className="user-profile-image mb-md-0 mb-3 d-flex d-md-inline">
            {!!mediaPhotos.length && (
              <img
                src={mediaPhotos[0].medias[0].mediaURL}
                alt={mediaPhotos[0].medias[0].name}
                title={mediaPhotos[0].medias[0].name}
                onClick={() => {
                  const { mediaDetailsPath } = mediaPathsGenerator(
                    job.id,
                    mediaPhotos[0].id,
                    IMediaKind.JobPhoto,
                    mediaPhotos[0].medias[0].id
                  );

                  const historyState: interfaces.IJobPhotoDetailsHistoryState =
                    {
                      job,
                      selectedSubMediaId: mediaPhotos[0].medias[0].id,
                      mediaSubKind: mediaPhotos[0].subKind,
                    };

                  history.push(mediaDetailsPath, historyState);
                }}
              />
              // <img
              //   src={mediaPhotos[0]?.mediaURL}
              //   alt={mediaPhotos[0].name}
              //   title={mediaPhotos[0].name}
              // />
            )}

            <div className="pl-3 d-md-none mobile-info-area flex-grow-1">
              <h5 className="sec-title d-block d-md-none mb-0">{job.title}</h5>
              <span>Due: {toLocaleDateString(job.endDt)}</span>
            </div>

            <div className="fill-white d-block d-md-none">
              <div data-toggle="dropdown" aria-expanded="false">
                <CameraIcon />
              </div>

              <ul className="dropdown-menu dropdown-menu-right border-0 shadow-sm">
                {!!(
                  job.currentUserJobPerm.permissions.mediaPhotos &
                  (CommonPerms.all | CommonPerms.add)
                ) && (
                  <Fragment>
                    <li
                      onClick={() => {
                        history.push(paths.photoAddPath, {
                          ...job,
                        } as IJobPhotoAddHistoryState);
                      }}
                    >
                      <button className="dropdown-item fs-13" type="button">
                        New Photo
                      </button>
                    </li>
                    <li className="dropdown-divider" />
                  </Fragment>
                )}

                {!!(
                  job.currentUserJobPerm.permissions.mediaVideos &
                  (CommonPerms.all | CommonPerms.add)
                ) && (
                  <li
                    onClick={() => {
                      history.push(paths.videoAddPath, {
                        ...job,
                      } as IJobVideoAddHistoryState);
                    }}
                  >
                    <button className="dropdown-item fs-13" type="button">
                      New Video
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="plumbing-profile-content mb-md-0 mb-3">
            <h5 className="sec-title d-none d-md-block">{job.title}</h5>
            {/* <CheckoutForm></CheckoutForm> */}
              {/* <button className="dropdown-item fs-13" type="button" onClick={() => handleStripeButton()}>
                Test Stripe
              </button> */}
            <span className="address-text-field">
              <DirectionIcon className="pr-sm-2" />

              <span onClick={() => window.open(job.googlePath, '_blank')}>
                {job.address.formatted}
              </span>
            </span>

            <div className="date-text-wrap d-none d-md-flex">
              <div className="date-text-content">
                <span className="date-text">Start Date</span>
                <span className="date">{toLocaleDateString(job.startDt)}</span>
                
                <div className="contributers-profile-content pb-3 flex-items-end">
                  {!!(
                    permissions.members &
                    (CommonPerms.all | CommonPerms.view | CommonPerms.edit) 
                    
                  ) && <JobWorkOrdersComponent />}
                </div>
                
                <div className="text-field flex-content mt-2 mt-sm-0 recent-contributor">
                  
                  <span className="gray-color ml-1">
                    Verify the Service Order Doc 
                  </span>
                </div>

                {/* {job.serviceIssues.ServiceManagerIssueID > 0 && (
                  <JobWorkOrdersComponent/>
                )} */}

              </div>
              <div className="date-text-content">
                <span className="date-text">Due Date</span>
                <span className="date">{toLocaleDateString(job.endDt)}</span>

                <div className="contributers-profile-content pb-3 flex-items-end">
                  {!!(
                    permissions.members &
                    (CommonPerms.all | CommonPerms.view | CommonPerms.edit)
                  ) && <JobContributorsComponent />}
                </div>

                {job.mostRecentContributorIndex !== -1 && (
                  <div className="text-field flex-content mt-2 mt-sm-0 recent-contributor">
                    <StarIcon />
                    <span className="gray-color ml-1">
                      Most recent contribution :{' '}
                      {toLocaleDTString(
                        job.contributors[job.mostRecentContributorIndex].details
                          .contributionUpdatedAt
                      )}
                    </span>
                  </div>
                )}


              </div>
            </div>
            {/* <div className="contributers-profile-content pb-3 flex-items-end">
              {!!(
                permissions.members &
                (CommonPerms.all | CommonPerms.view | CommonPerms.edit)
              ) && <JobContributorsComponent />}
            </div>

            {job.mostRecentContributorIndex !== -1 && (
              <div className="text-field flex-content mt-2 mt-sm-0 recent-contributor">
                <StarIcon />
                <span className="gray-color ml-1">
                  Most recent contribution :{' '}
                  {toLocaleDTString(
                    job.contributors[job.mostRecentContributorIndex].details
                      .contributionUpdatedAt
                  )}
                </span>
              </div>
            )} */}
            {/* {job.serviceIssues.ServiceManagerIssueID > 0 && (
              <div className="contributor-title">
                <div className="sell-link-wrap">
                  <span className="title">
                    ServiceIssue ID:{' '}
                    <span className="title">
                      {job.serviceIssues.ServiceManagerIssueID}
                    </span>
                  </span>
                  <span className="dot mr-1">....</span>
                  <span
                    className="sell-all-link"
                    onClick={() => {
                      setContributorsPopup(true);
                    }}
                  >
                    See Work Orders
                  </span>
                </div>
              </div>
            )} */}

            
          </div>
        </div>
        {!isMobile && (
          <div className="btn-wrap flex-content d-none d-md-inlne-block">
            {JobOptionsComponent()}
           
          </div>
        )}
      </div>
      <div className="plumbing-tab-wrap">
        <div className="tab-sec-wrap">
          <div className="tab-sec-content">
            {tabLinks()}
            <div className="tab-content px-3" id="pills-tabContent">
              {selectedTab === 'pills-home' && tabPerms.media && (
                <TabMedia job={job} setJob={setJob} userJobPerm={permissions} />
              )}

              {selectedTab === 'pills-document' && tabPerms.documents && (
                <TabDocument
                  job={job}
                  setJob={setJob}
                  userJobPerm={permissions}
                />
              )}
{selectedTab === 'pills-bills' && tabPerms.bills && (
                <TabBills
                  job={job}
                  setJob={setJob}
                  userJobPerm={permissions}
                  fulljob={fullJob}
                />
              )}
              {selectedTab === 'pills-converstation' &&
                tabPerms.conversations && (
                  <TabConversation
                    job={job}
                    setJob={setJob}
                    user={authUser}
                    userJobPerm={permissions}
                    search={searchFilter}
                  />
                )}
              {selectedTab === 'pills-notpad' && tabPerms.notes && (
                <TabNotepad
                  job={job}
                  setJob={setJob}
                  user={authUser}
                  userJobPerm={permissions}
                  search={searchFilter}
                />
              )}
              {selectedTab === 'pills-comments' && tabPerms.comments && (
                <TabComments
                  job={job}
                  setJob={setJob}
                  userJobPerm={permissions}
                  search={searchFilter}
                />
              )}
              {selectedTab === 'pills-timeline' && tabPerms.timeline && (
                <TabTimeline
                  filterPopup={filterPopup}
                  setFilterPopup={setFilterPopup}
                  sortOrder={sortOrder}
                  // setFilterOrder={setFilterOrder}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
