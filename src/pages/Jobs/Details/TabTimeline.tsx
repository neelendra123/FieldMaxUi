import { Fragment, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { useMountedState } from 'react-use';

import { toLocaleTimeString } from '../../../utils/common';

import { Popup } from '../../../components/Common';
import { DtRangeFilters } from '../../../components/Common';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import { IJobSubModuleTypes } from '../../Orgs/interfaces';

import { TimelineMediaIcon } from '../../Medias/Common';

import * as TimelineInterfaces from '../../Timelines/interfaces';

import {
  ChatIcon,
  DocEditIcon,
  DocIcon,
  MediaIcon,
  ShieldIcon,
} from '../../../components/Icons';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';
import * as utils from '../utils';

type FilterType = Record<string, boolean>;

export default function TabTimeline({
  setFilterPopup,
  filterPopup,
  sortOrder,
}: {
  filterPopup: boolean;
  setFilterPopup: (open: boolean) => void;

  sortOrder: 'asc' | 'desc';
  // setFilterOrder: (value: 'asc' | 'desc') => void;
}) {
  const isMounted = useMountedState();

  const params: { jobId: string } = useParams();

  const [isFetching, setIsFetching] = useState(false);

  const [timelines, setTimelines] = useState<
    TimelineInterfaces.IJobDetailsTabTimelineList[]
  >([]);

  const [startDt, setStartDt] = useState(
    moment().subtract(1, 'month').startOf('day').format()
  );
  const [endDt, setEndDt] = useState(moment().endOf('day').format());

  //  Item Filters
  const [itemFilters, setItemFilters] =
    useState<interfaces.IJobDetailTimelineItemFilters>({
      ...constants.DefaultJobDetailTimelineItemFilters,
    });
  const toggleItemFilter = (
    type: interfaces.IJobDetailTimelineItemFilterTypes,
    checked: boolean
  ) => {
    if (type === IJobSubModuleTypes.base) {
      //  All Checkbox
      setItemFilters({
        base: checked,
        mediaPhotos: checked,
        mediaVideos: checked,
        documents: checked,
        comments: checked,
        conversations: checked,
        notes: checked,
      });

      return;
    }

    const newItemFilters = {
      ...itemFilters,
      [type]: checked,
    };
    if (type === IJobSubModuleTypes.mediaPhotos) {
      newItemFilters.mediaVideos = checked;
    }

    if (!checked) {
      //  This is to auto uncheck the all checkbox on unselecting a item filter
      newItemFilters.base = false;
    } else {
      //  This is to auto check the all checkbox if all the other filters are selected
      if (
        newItemFilters.mediaPhotos &&
        newItemFilters.mediaVideos &&
        newItemFilters.documents &&
        newItemFilters.comments &&
        newItemFilters.conversations &&
        newItemFilters.notes
      ) {
        newItemFilters.base = true;
      }
    }

    setItemFilters(newItemFilters);
  };

  //  User Update Filters
  const [userUpdateFilters, setUserUpdateFilters] = useState({
    ...constants.DefaultJobDetailTimelineUserUpdateFilters,
  });
  const toggleUserUpdateFilter = (
    type: interfaces.IJobDetailTimelineUserUpdateFilterTypes,
    checked: boolean
  ) => {
    if (type === IJobSubModuleTypes.base) {
      //  All Checkbox
      setUserUpdateFilters({
        base: checked,
        permissions: checked,
        invitation: checked,
        termination: checked,
      });

      return;
    }

    const newUserUpdateFilters = {
      ...userUpdateFilters,
      [type]: checked,
    };

    if (!checked) {
      //  This is to auto uncheck the all checkbox on unselecting a user update filter
      newUserUpdateFilters.base = false;
    } else {
      //  This is to auto check the all checkbox if all the other filters are selected
      if (
        newUserUpdateFilters.permissions &&
        newUserUpdateFilters.invitation &&
        newUserUpdateFilters.termination
      ) {
        newUserUpdateFilters.base = true;
      }
    }

    setUserUpdateFilters(newUserUpdateFilters);
  };

  //  Users Filters
  const [members, setMembers] = useState<
    {
      userId: string;
      name: string;
    }[]
  >([]);

  const [userFilters, setUserFilters] = useState<FilterType>({
    base: true,
  });
  const toggleUserFilter = (type: string, checked: boolean) => {
    if (type === IJobSubModuleTypes.base) {
      //  All Checkbox
      let newUserFilters: FilterType = {
        base: checked,
      };
      members.forEach((member) => {
        newUserFilters[member.userId] = checked;
      });

      setUserFilters(newUserFilters);

      return;
    }

    let newUserFilters: FilterType = {
      ...userFilters,
      [type]: checked,
    };

    if (!checked) {
      //  This is to auto uncheck the all checkbox on unselecting a user update filter
      newUserFilters.base = false;
    } else {
      //  This is to auto check the all checkbox if all the other filters are selected
      let baseSelected = true; //newUserFilters.base
      Object.keys(newUserFilters).forEach((newUserFilter) => {
        if (newUserFilter === 'base') {
          return;
        }
        if (!newUserFilters[newUserFilter]) {
          baseSelected = false;
        }
      });

      newUserFilters.base = baseSelected;
    }

    setUserFilters(newUserFilters);
  };

  //  Fetching Members listing for Filter Popup
  const fetchMembers = async () => {
    setIsFetching(true);
    try {
      const jobMembers = await services.jobSubModuleMembersListService(
        params.jobId,
        {
          skipInviteCheck: true,
          skipSubModuleCheck: true,
        }
      );
      if (!isMounted()) {
        return;
      }

      let uFilter: FilterType = {
        base: true,
      };

      let members = jobMembers.map((jobMember) => {
        uFilter[jobMember.id] = true;

        return {
          userId: jobMember.id,
          name: formatUserName(jobMember.firstName, jobMember.lastName),
        };
      });

      setUserFilters(uFilter);

      setMembers(members);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  //  Fetching Timeline with Filters
  const fetchData = async () => {
    setFilterPopup(false);
    setIsFetching(true);
    try {
      let uFilters: string[] = [];
      if (!userFilters.base) {
        //  Only Sending User Ids if all option is not selected
        Object.keys(userFilters).forEach((userFilter) => {
          if (userFilter !== 'base' && userFilters[userFilter]) {
            uFilters.push(userFilter);
          }
        });
      }

      const data: TimelineInterfaces.IJobDetailTimelineListReqData = {
        sortOrder,
        startDt: moment(startDt).utc().format(),
        endDt: moment(endDt).utc().format(),
        itemFilters: {
          mediaPhotos: itemFilters.mediaPhotos,
          mediaVideos: itemFilters.mediaVideos,
          documents: itemFilters.documents,
          conversations: itemFilters.conversations,
          comments: itemFilters.comments,
          notes: itemFilters.notes,
        },
        userUpdateFilters: {
          permissions: userUpdateFilters.permissions,
          invitation: userUpdateFilters.invitation,
          termination: userUpdateFilters.termination,
        },
        userFilters: uFilters,
      };

      const result = await services.jobDetailTimelineListService(
        params.jobId,
        data
      );
      if (!isMounted()) {
        return;
      }

      const parsedTimelines = utils.parseJobDetailsTimelines(result);

      setTimelines(parsedTimelines);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchMembers();

    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  // const HTMLExampleComp = () => {
  //   return (
  //     <Fragment>
  //       <div className="date-border-text">
  //         <h6 className="title">Jun 22, 2021</h6>
  //       </div>
  //       <div className="plumbing-tab-profile-wrap timeline-content">
  //         <div className="flex-space-between">
  //           <div className="flex-grow-1">
  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   <DocEditIcon />
  //                   Christan Gray left new entry in notes
  //                 </span>
  //               </h6>

  //               <div className="tab-list-content">
  //                 <p className="mb-2 mt-2 ">
  //                   Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.
  //                 </p>
  //                 <span className="date-text">6:00 PM</span>
  //               </div>
  //             </div>

  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   <DocEditIcon />
  //                   Christan Gray left new entry in notes
  //                 </span>
  //               </h6>

  //               <div className="tab-list-content">
  //                 <p className="mb-2 mt-2 ">
  //                   Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.
  //                 </p>
  //                 <span className="date-text">6:00 PM</span>
  //               </div>
  //             </div>

  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   <img
  //                     className="mr-3"
  //                     src={
  //                       require('../../../assets/images/message.svg').default
  //                     }
  //                     alt={'edit icon'}
  //                   />
  //                   Christan Gray left new messages in conversation.
  //                 </span>
  //               </h6>

  //               <div className="tab-list-content">
  //                 <p className="mb-2 mt-2 ">
  //                   “Lorem Ipsum is simply dummy text of the printing and
  //                   typeset.Lorem Ipsum is simply dummy”
  //                 </p>
  //                 <span className="date-text">6:00 PM</span>
  //               </div>
  //             </div>

  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   {' '}
  //                   <img
  //                     className="mr-3"
  //                     src={
  //                       require('../../../assets/images/icontext_message.svg')
  //                         .default
  //                     }
  //                     alt={'edit icon'}
  //                   />{' '}
  //                   Christan Gray commented on photo “jobname2.jpeg”.
  //                 </span>
  //               </h6>
  //               <div className="tab-list-content mt-2 mb-4">
  //                 <div className="media-box-wrap media-box-wrap-col timeline-wrap">
  //                   <div className="media-box-content mb-0">
  //                     <div className="d-flex">
  //                       <Link
  //                         to="/jobs/details/media"
  //                         className="media-box-img-link"
  //                       >
  //                         <img
  //                           src={
  //                             require('../../../assets/images/media-blog-img.png')
  //                               .default
  //                           }
  //                           alt="media blog img"
  //                         />
  //                       </Link>

  //                       <p>
  //                         “Hi this photo is really helpfull for our project”
  //                       </p>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <span className="date-text mt-2 d-inline-block">6:00 PM</span>
  //               </div>
  //             </div>

  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   {' '}
  //                   <img
  //                     className="mr-3"
  //                     src={
  //                       require('../../../assets/images/document_message.svg')
  //                         .default
  //                     }
  //                     alt={'edit icon'}
  //                   />{' '}
  //                   Christan Gray commented on photo “jobname2.jpeg”.
  //                 </span>
  //               </h6>
  //               <div className="tab-list-content mt-2 mb-4">
  //                 <div className="media-box-wrap media-box-wrap-col timeline-wrap">
  //                   <div className="media-box-content mb-0">
  //                     <div className="d-flex">
  //                       <Link
  //                         to="/jobs/details/media"
  //                         className="media-box-img-link"
  //                       >
  //                         <img
  //                           src={
  //                             require('../../../assets/images/document.svg')
  //                               .default
  //                           }
  //                           alt="media blog img"
  //                         />
  //                       </Link>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <span className="date-text mt-2 d-inline-block">6:00 PM</span>
  //               </div>
  //             </div>

  //             <div className="tab-profile-content mt-3">
  //               <h6 className="title mb-1">
  //                 <span className="black-text d-flex align-items-center">
  //                   {' '}
  //                   <ShieldIcon />
  //                   Christan Gray updated Rohit’s job permission.
  //                 </span>
  //               </h6>
  //               <div className="tab-list-content mt-2 mb-4">
  //                 <div className="media-box-wrap media-box-wrap-col timeline-wrap">
  //                   <div className="media-box-content mb-0">
  //                     <div className="d-flex">
  //                       <Link
  //                         to="/jobs/details/media"
  //                         className="media-box-img-link"
  //                       >
  //                         <img
  //                           style={{ borderRadius: '50%' }}
  //                           src={
  //                             require('../../../assets/images/media-blog-img.png')
  //                               .default
  //                           }
  //                           alt="media blog img"
  //                         />
  //                       </Link>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <span className="date-text mt-2 d-inline-block">6:00 PM</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="date-border-text">
  //         <h6 className="title">Jun 23, 2021</h6>
  //       </div>
  //       <div className="plumbing-tab-profile-wrap timeline-content">
  //         <div className="flex-content-start">
  //           <div className="tab-profile-content">
  //             <h6 className="title mb-1">
  //               <span className="black-text d-flex align-items-center">
  //                 {' '}
  //                 <MediaIcon />
  //                 <ShieldIcon />
  //                 <DocIcon />
  //                 <ChatIcon /> Christan Gray added 5 new photos
  //               </span>
  //             </h6>
  //             <div className="tab-list-content mt-2 mb-4">
  //               <div className="media-box-wrap media-box-wrap-col timeline-wrap">
  //                 <div className="media-box-content mb-0">
  //                   <div className="d-flex">
  //                     <Link
  //                       to="/jobs/details/media"
  //                       className="media-box-img-link"
  //                     >
  //                       <img
  //                         src={
  //                           require('../../../assets/images/media-blog-img.png')
  //                             .default
  //                         }
  //                         alt="media blog img"
  //                       />
  //                     </Link>

  //                     <Link
  //                       to="/jobs/details/media"
  //                       className="media-box-img-link"
  //                     >
  //                       <img
  //                         src={
  //                           require('../../../assets/images/media-blog-img.png')
  //                             .default
  //                         }
  //                         alt="media blog img"
  //                       />
  //                     </Link>
  //                   </div>
  //                 </div>
  //               </div>
  //               <span className="date-text mt-2 d-inline-block">6:00 PM</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Fragment>
  //   );
  // };

  const FiltersPopupComp = () => {
    return (
      <Fragment>
        {filterPopup
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}
        <Popup
          isOpen={filterPopup}
          title={'Timeline Filters'}
          hideButton={true}
          onClose={() => {
            setFilterPopup(false);
          }}
          ModalName={'Delete'}
          footerSaveChanges={() => {
            fetchData();
          }}
          addClassToWrapper="big-media-box vw-70"
          leftItemViewOnlyClass="flex-space-center"
        >
          <div>
            <p>
              <b>Date Range</b>
            </p>
            <div className="d-flex">
              <div className="col-12 col-md-6 col-lg-6">
                <div className="form-group">
                  <DtRangeFilters
                    label=""
                    drops="down"
                    timePicker
                    startDt={startDt}
                    endDt={endDt}
                    maxDate={new Date()}
                    onChange={(startDt, endDt) => {
                      setStartDt(startDt);
                      setEndDt(endDt);
                    }}
                  />
                </div>
              </div>
            </div>

            <p>
              <b>Items</b>
            </p>
            <div className="d-flex flex-wrap">
              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-3"
                  type="checkbox"
                  checked={itemFilters.base}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.base,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-3">All</label>
              </div>
              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-4"
                  type="checkbox"
                  checked={itemFilters.mediaPhotos}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.mediaPhotos,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-4">Media</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-5"
                  type="checkbox"
                  checked={itemFilters.documents}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.documents,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-5">Document</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-6"
                  type="checkbox"
                  checked={itemFilters.conversations}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.conversations,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-6">Conversation</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-7"
                  type="checkbox"
                  checked={itemFilters.notes}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.notes,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-7">Notes</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-8"
                  type="checkbox"
                  checked={itemFilters.comments}
                  onChange={(event) => {
                    toggleItemFilter(
                      IJobSubModuleTypes.comments,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-8">Comments</label>
              </div>
            </div>

            <p>
              <b>User Updates</b>
            </p>
            <div className="d-flex flex-wrap">
              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-21"
                  type="checkbox"
                  checked={userUpdateFilters.base}
                  onChange={(event) => {
                    toggleUserUpdateFilter(
                      IJobSubModuleTypes.base,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor="styled-checkbox-21">All</label>
              </div>
              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-22"
                  type="checkbox"
                  checked={userUpdateFilters.permissions}
                  onChange={(event) => {
                    toggleUserUpdateFilter('permissions', event.target.checked);
                  }}
                />
                <label htmlFor="styled-checkbox-22">Permissions</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-23"
                  type="checkbox"
                  checked={userUpdateFilters.invitation}
                  onChange={(event) => {
                    toggleUserUpdateFilter('invitation', event.target.checked);
                  }}
                />
                <label htmlFor="styled-checkbox-23">Invitation</label>
              </div>

              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-24"
                  type="checkbox"
                  checked={userUpdateFilters.termination}
                  onChange={(event) => {
                    toggleUserUpdateFilter('termination', event.target.checked);
                  }}
                />
                <label htmlFor="styled-checkbox-24">Termination</label>
              </div>
            </div>

            <p>
              <b>Users</b>
            </p>
            <div className="d-flex flex-wrap">
              <div className="mr-5 mb-3">
                <input
                  className="styled-checkbox"
                  id="styled-checkbox-11"
                  type="checkbox"
                  checked={userFilters.base}
                  onChange={(event) => {
                    toggleUserFilter('base', event.target.checked);
                  }}
                />
                <label htmlFor="styled-checkbox-11">All</label>
              </div>

              {members.map((member) => {
                const userId = member.userId;
                const id = `styled-checkbox-${userId}`;

                return (
                  <div className="mr-5 mb-3" key={userId}>
                    <input
                      className="styled-checkbox"
                      id={id}
                      type="checkbox"
                      checked={userFilters[userId]}
                      onChange={(event) => {
                        toggleUserFilter(userId, event.target.checked);
                      }}
                    />
                    <label htmlFor={id}>{member.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </Popup>
      </Fragment>
    );
  };

  //  Job Events like: Create, Delete, Edit Info, Members Events
  const JobEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IJobCreateTimelineEvent
      | TimelineInterfaces.IJobDeleteTimelineEvent
      | TimelineInterfaces.IJobDetailEditTimelineEvent;
    userName: string;
    time: string;
  }) => {
    const { event } = timelineEvent;

    return (
      <div className="tab-profile-content mt-3" key={timelineEvent.id}>
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            <DocEditIcon />

            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobCreate && (
              <span className="ml-2">{userName} created the job. </span>
            )}

            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobDetailEdit && (
              <span className="ml-2">{userName} edited the job detail. </span>
            )}

            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobDelete && (
              <span className="ml-2">{userName} deleted the job. </span>
            )}
          </span>
        </h6>

        <div className="tab-list-content">
          <p className="mb-2 mt-2 ">Job Info Edited</p>
          <span className="date-text">
            {toLocaleTimeString(timelineEvent.createdAt)}
          </span>
        </div>
      </div>
    );
  };
  const JobMemberEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IJobMemberDeleteTimelineEvent
      | TimelineInterfaces.IJobMemberEditTimelineEvent
      | TimelineInterfaces.IJobMemberAddTimelineEvent;
    userName: string;
    time: string;
  }) => {
    const memberName = formatUserName(
      timelineEvent.member.firstName,
      timelineEvent.member.lastName
    );

    const { event } = timelineEvent;

    return (
      <div className="tab-profile-content mt-3">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            <ShieldIcon title={event} />
            &nbsp;
            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberDelete && (
              <Fragment>
                {userName} removed the member {memberName}.
              </Fragment>
            )}
            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberEdit && (
              <Fragment>
                {userName} edited permission of the member {memberName}.
              </Fragment>
            )}
            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberAdd && (
              <Fragment>
                {userName} added the member {memberName}.
              </Fragment>
            )}
          </span>
        </h6>
        <div className="tab-list-content mt-2 mb-4">
          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <div className="media-box-content mb-0">
              <div className="d-flex">
                <Link to="/#" className="media-box-img-link">
                  <img
                    style={{ borderRadius: '50%' }}
                    src={timelineEvent.member.picURL || DefaultUserPic}
                    alt={memberName}
                    title={memberName}
                  />
                </Link>
              </div>
            </div>
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };
  //  Job Events for Member Invite -> Send, Accept, Reject
  const JobMemberInviteEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IJobMemberInviteTimelineEvent
      | TimelineInterfaces.IJobMemberInviteAcceptTimelineEvent
      | TimelineInterfaces.IJobMemberInviteRejectTimelineEvent;
    userName: string;
    time: string;
  }) => {
    const memberName = formatUserName(
      timelineEvent.member.firstName,
      timelineEvent.member.lastName
    );

    const { event } = timelineEvent;

    return (
      <div className="tab-profile-content mt-3">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            <ShieldIcon title={event} />
            &nbsp;
            {event ===
              TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberInvite && (
              <Fragment>
                {userName} invited the member {memberName}.
              </Fragment>
            )}
            {event ===
              TimelineInterfaces.IInviteTimelineMetaDataEvent
                .InviteAccepted && (
              <Fragment>{userName} accepted the invitation.</Fragment>
            )}
            {event ===
              TimelineInterfaces.IInviteTimelineMetaDataEvent
                .InviteRejected && (
              <Fragment>{userName} rejected the invitation.</Fragment>
            )}
          </span>
        </h6>
        <div className="tab-list-content mt-2 mb-4">
          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <div className="media-box-content mb-0">
              <div className="d-flex">
                <Link to="/#" className="media-box-img-link">
                  <img
                    style={{ borderRadius: '50%' }}
                    src={timelineEvent.member.picURL || DefaultUserPic}
                    alt={memberName}
                    title={memberName}
                  />
                </Link>
              </div>
            </div>
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Photo
  const PhotoEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IPhotoCreateTimelineEvent
      | TimelineInterfaces.IPhotoDeleteTimelineEvent
      | TimelineInterfaces.IPhotoSubMediaInfoEditTimelineEvent
      | TimelineInterfaces.IPhotoSubMediaPermEditTimelineEvent
      | TimelineInterfaces.IPhotoSubMediaLinkCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, media } = timelineEvent;

    const selectedSubMediaId =
      //@ts-ignore
      timelineEvent.reqData?.['subMediaId'];

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <MediaIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.PhotoCreate && (
                <Fragment>
                  {userName} added a {media.subKind} Photo
                </Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.PhotoDelete && (
                <Fragment>{userName} deleted a Photo</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .PhotoSubMediaInfoEdit && (
                <Fragment>{userName} edited info of the Photo</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .PhotoSubMediaPermEdit && (
                <Fragment>
                  {userName} edited member permission of the Photo
                </Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .PhotoSubMediaLinkCreate && (
                <Fragment>
                  {userName} created a public link for the Photo
                </Fragment>
              )}
            </span>
          </span>
        </h6>
        <div className="tab-list-content mt-2 mb-4">
          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <TimelineMediaIcon
              jobId={params.jobId}
              media={media}
              selectedSubMediaId={selectedSubMediaId}
            />
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Video
  const VideoEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IVideoCreateTimelineEvent
      | TimelineInterfaces.IVideoDeleteTimelineEvent
      | TimelineInterfaces.IVideoSubMediaInfoEditTimelineEvent
      | TimelineInterfaces.IVideoSubMediaPermEditTimelineEvent
      | TimelineInterfaces.IVideoSubMediaLinkCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, media } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <MediaIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.VideoCreate && (
                <Fragment>{userName} added a Video</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.VideoDelete && (
                <Fragment>{userName} deleted a Video</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .VideoSubMediaInfoEdit && (
                <Fragment>{userName} edited info of the Video</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .VideoSubMediaPermEdit && (
                <Fragment>
                  {userName} edited member permission of the Video
                </Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .VideoSubMediaLinkCreate && (
                <Fragment>
                  {userName} created a public link for the Video
                </Fragment>
              )}
            </span>
          </span>
        </h6>
        <div className="tab-list-content mt-2 mb-4">
          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <TimelineMediaIcon jobId={params.jobId} media={media} />
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Document
  const DocEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent:
      | TimelineInterfaces.IDocCreateTimelineEvent
      | TimelineInterfaces.IDocDeleteTimelineEvent
      | TimelineInterfaces.IDocSubMediaInfoEditTimelineEvent
      | TimelineInterfaces.IDocSubMediaPermEditTimelineEvent
      | TimelineInterfaces.IDocSubMediaLinkCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, media } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <DocIcon title={media.name} />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.DocCreate && (
                <Fragment>{userName} added a Document.</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent.DocDelete && (
                <Fragment>{userName} deleted a Document</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .DocSubMediaInfoEdit && (
                <Fragment>{userName} edited info of the Document</Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .DocSubMediaPermEdit && (
                <Fragment>
                  {userName} edited member permission of the Document
                </Fragment>
              )}
              {event ===
                TimelineInterfaces.IMediaTimelineMetaDataEvent
                  .DocSubMediaLinkCreate && (
                <Fragment>
                  {userName} created a public link for the Document
                </Fragment>
              )}
            </span>
          </span>
        </h6>
        <div className="tab-list-content mt-2 mb-4">
          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <TimelineMediaIcon jobId={params.jobId} media={media} />
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Comment
  const CommentEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent: TimelineInterfaces.ICommentCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, postData, media } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <ChatIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IConversationTimelineMetaDataEvent
                  .CommentCreate && (
                <Fragment>{userName} left new entry in comments</Fragment>
              )}
            </span>
          </span>
        </h6>

        <div className="tab-list-content mt-2 mb-4">
          <p className="mb-2 mt-2 ">
            {event ===
              TimelineInterfaces.IConversationTimelineMetaDataEvent
                .CommentCreate && <Fragment>{postData.message}</Fragment>}
          </p>

          <div className="media-box-wrap media-box-wrap-col timeline-wrap">
            <TimelineMediaIcon
              jobId={params.jobId}
              media={media}
              selectedSubMediaId={postData.subMediaId}
            />
          </div>
          <span className="date-text mt-2 d-inline-block">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Conversation
  const ConversationEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent: TimelineInterfaces.IConversationCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, postData } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <ChatIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IConversationTimelineMetaDataEvent
                  .ConversationCreate && (
                <Fragment>{userName} left new entry in conversations</Fragment>
              )}
            </span>
          </span>
        </h6>

        <div className="tab-list-content">
          <p className="mb-2 mt-2 ">
            {event ===
              TimelineInterfaces.IConversationTimelineMetaDataEvent
                .ConversationCreate && <Fragment>{postData.message}</Fragment>}
          </p>
          <span className="date-text">{time}</span>
        </div>
      </div>
    );
  };

  //  Events for Notepad
  const NotepadEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent: TimelineInterfaces.INoteCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, postData } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <DocEditIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IConversationTimelineMetaDataEvent
                  .NoteCreate && (
                <Fragment>{userName} left new entry in notes</Fragment>
              )}
            </span>
          </span>
        </h6>

        <div className="tab-list-content">
          <p className="mb-2 mt-2 ">
            {event ===
              TimelineInterfaces.IConversationTimelineMetaDataEvent
                .NoteCreate && <Fragment>{postData.message}</Fragment>}
          </p>
          <span className="date-text">{time}</span>
        </div>
      </div>
    );
  };
  //
  //
  const VendorBillsEventComp = ({
    timelineEvent,
    userName,
    time,
  }: {
    timelineEvent: TimelineInterfaces.IBillsCreateTimelineEvent;
    userName: string;
    time: string;
  }) => {
    let { event, postData } = timelineEvent;

    return (
      <div className="tab-profile-content">
        <h6 className="title mb-1">
          <span className="black-text d-flex align-items-center">
            {' '}
            <DocEditIcon />{' '}
            <span className="ml-2">
              {' '}
              {event ===
                TimelineInterfaces.IBillsTimelineMetaDataEvent
                  .VendorBills && (
                <Fragment>{userName} paid the vendor bills</Fragment>
              )}
            </span>
          </span>
        </h6>

        <div className="tab-list-content">
          <p className="mb-2 mt-2 ">
            {event ===
              TimelineInterfaces.IBillsTimelineMetaDataEvent
                .VendorBills && <Fragment>{}</Fragment>}
          </p>
          <span className="date-text">{time}</span>
        </div>
      </div>
    );
  };

  const getType = (timelineEvent: TimelineInterfaces.IJobTimelineEvent) => {
    const time = toLocaleTimeString(timelineEvent.createdAt);
    const userName = formatUserName(
      timelineEvent.user.firstName,
      timelineEvent.user.lastName
    );

    switch (timelineEvent.event) {
      //  Job Events like: Create, Delete, Edit Info, Members Events
      //@ts-ignore
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobCreate: {
      }
      //@ts-ignore
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobDelete: {
      }

      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobDetailEdit: {
        return (
          <JobEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }
      //  Job Members Events like: Delete, Edit, Add
      //@ts-ignore
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberDelete: {
      }
      //@ts-ignore
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberEdit: {
      }
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberAdd: {
        return (
          <JobMemberEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }
      //  Job Events for Member Invite -> Send, Accept, Reject
      //@ts-ignore
      case TimelineInterfaces.IJobTimelineMetaDataEvent.JobMemberInvite: {
      }
      //@ts-ignore
      case TimelineInterfaces.IInviteTimelineMetaDataEvent.InviteAccepted: {
      }
      case TimelineInterfaces.IInviteTimelineMetaDataEvent.InviteRejected: {
        return (
          <JobMemberInviteEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }
      //  Photo Events
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.PhotoCreate: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.PhotoDelete: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .PhotoSubMediaInfoEdit: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .PhotoSubMediaPermEdit: {
      }
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .PhotoSubMediaLinkCreate: {
        return (
          <PhotoEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }

      //  Video Events
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.VideoCreate: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.VideoDelete: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .VideoSubMediaInfoEdit: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .VideoSubMediaPermEdit: {
      }
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .VideoSubMediaLinkCreate: {
        return (
          <VideoEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }

      //  Document Events
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.DocCreate: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.DocDelete: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.DocSubMediaInfoEdit: {
      }
      //@ts-ignore
      case TimelineInterfaces.IMediaTimelineMetaDataEvent.DocSubMediaPermEdit: {
      }
      case TimelineInterfaces.IMediaTimelineMetaDataEvent
        .DocSubMediaLinkCreate: {
        return (
          <DocEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }

      //  Events For Comment
      case TimelineInterfaces.IConversationTimelineMetaDataEvent
        .CommentCreate: {
        return (
          <CommentEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }

      //  Events For Conversation
      case TimelineInterfaces.IConversationTimelineMetaDataEvent
        .ConversationCreate: {
        return (
          <ConversationEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }

      //  Events For Notepad
      case TimelineInterfaces.IConversationTimelineMetaDataEvent.NoteCreate: {
        return (
          <NotepadEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }
      //Events for vendor bills
      case TimelineInterfaces.IBillsTimelineMetaDataEvent.VendorBills: {
        return (
          <VendorBillsEventComp
            time={time}
            userName={userName}
            timelineEvent={timelineEvent}
          />
        );
      }
      
    }
  };

  return (
    <div
      className="tab-pane fade show active px-3"
      id="pills-timeline"
      role="tabpanel"
      aria-labelledby="pills-timeline-tab"
    >
      <FiltersPopupComp />

      {/* <HTMLExampleComp /> */}

      {timelines.map((timeline) => {
        return (
          <Fragment key={timeline.key}>
            <div className="date-border-text">
              <h6 className="title">{timeline.key}</h6>
            </div>

            <div className="plumbing-tab-profile-wrap timeline-content">
              <div className="flex-space-between">
                <div className="flex-grow-1">
                  {timeline.events.map((timelineEvent) => {
                    return (
                      <Fragment key={timelineEvent.id}>
                        {getType(timelineEvent)}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
