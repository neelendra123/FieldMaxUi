import { Fragment } from 'react';
import {
  ChatIcon,
  DocEditIcon,
  MediaIcon,
  ShieldIcon,
} from '../../../components/Icons';
import { DefaultAccountPic } from '../../Accounts/constants';
import { DefaultUserPic } from '../../Users/constants';

export default function () {
  return (
    <Fragment>
      <div className="plumbing-tab-wrap">
        <div className="date-border-text">
          <h6 className="title">Jun 22, 2021</h6>
        </div>
        <div className="plumbing-tab-profile-wrap timeline-content">
          <div className="flex-space-between">
            <div className="flex-grow-1">
              <div className="tab-profile-content mt-3">
                <h6 className="title mb-1">
                  <span className="black-text d-flex align-items-center">
                    <DocEditIcon className={'mr-2'} />
                    Christan Gray deleted John Wick’s note.
                  </span>
                </h6>

                <div className="tab-list-content">
                  <p className="mb-2 mt-2 ">
                    Lorem Ipsum is simply dummy text of the printing and
                    typeset.Lorem Ipsum is simply dummy text of the printing and
                    typeset.Lorem Ipsum is simply dummy text of the printing and
                    typeset.
                  </p>
                  <span className="date-text">6:00 PM</span>
                </div>
              </div>

              <div className="tab-profile-content mt-3">
                <h6 className="title mb-1">
                  <span className="black-text d-flex align-items-center">
                    <DocEditIcon className={'mr-2'} />
                    Christan Gray left new entry in notes
                  </span>
                </h6>

                <div className="tab-list-content">
                  <p className="mb-2 mt-2 ">
                    Lorem Ipsum is simply dummy text of the printing and
                    typeset.Lorem Ipsum is simply dummy text of the printing and
                    typeset.Lorem Ipsum is simply dummy text of the printing and
                    typeset.
                  </p>
                  <span className="date-text">6:00 PM</span>
                </div>
              </div>

              <div className="tab-profile-content mt-3">
                <h6 className="title mb-1">
                  <span className="black-text d-flex align-items-center">
                    <DocEditIcon className={'mr-2'} />
                    Christan Gray left new messages in conversation.
                  </span>
                </h6>

                <div className="tab-list-content">
                  <p className="mb-2 mt-2 ">
                    “Lorem Ipsum is simply dummy text of the printing and
                    typeset.Lorem Ipsum is simply dummy”
                  </p>
                  <span className="date-text">6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="date-border-text">
          <h6 className="title">Jun 23, 2021</h6>
        </div>
        <div className="plumbing-tab-profile-wrap timeline-content">
          <div className="flex-content-start">
            <div className="tab-profile-content">
              <h6 className="title mb-1">
                <span className="black-text d-flex align-items-center">
                  {' '}
                  {/* <MediaIcon /> */}
                  <ShieldIcon className={'mr-2'} />
                  {/* <DocEditIcon /> */}
                  {/* <ChatIcon />  */}
                  Christan Gray added 5 new photos
                </span>
              </h6>
              <div className="tab-list-content mt-2 mb-4">
                <div className="media-box-wrap media-box-wrap-col timeline-wrap">
                  <div className="media-box-content mb-0">
                    <div className="d-flex">
                      <img
                        className="rounded-circle mr-2"
                        src={DefaultUserPic}
                        alt="media blog img"
                      />
                      <img
                        className="rounded-circle mr-2"
                        src={DefaultUserPic}
                        alt="media blog img"
                      />
                      {/* <img src={DefaultAccountPic} alt="media blog img" /> */}
                    </div>
                  </div>
                </div>
                <span className="date-text mt-2 d-inline-block">6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}