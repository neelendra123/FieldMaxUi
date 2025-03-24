import { useState } from 'react';
import { CommonPerms } from '../../../constants';

import { IJobSubModuleTypes, IJobSubModulePerms } from '../../Orgs/interfaces';
import { generateJobSubModulePerms } from '../../Orgs/utils';

const JobPermissions = ({
  permissions = generateJobSubModulePerms(),
  onSave,
}: {
  permissions: IJobSubModulePerms;

  onSave: (job: IJobSubModulePerms, pageChange: boolean) => void;
}) => {
  const [parent, setParent] = useState(permissions.parent);
  const [base, setBase] = useState(permissions.base);
  const [mediaPhotos, setMediaPhotos] = useState(permissions.mediaPhotos);
  const [mediaVideos, setMediaVideos] = useState(permissions.mediaVideos);
  const [documents, setDocuments] = useState(permissions.documents);
  const [conversations, setConversations] = useState(permissions.conversations);
  const [notes, setNotes] = useState(permissions.notes);
  const [comments, setComments] = useState(permissions.comments);
  const [members, setMembers] = useState(permissions.members);

  const parentChange = (isChecked: boolean) => {
    const newValue = isChecked ? CommonPerms.all : CommonPerms.none;

    let parentPerms: IJobSubModulePerms = {
      parent: newValue,
      base: newValue,
      mediaPhotos: newValue,
      mediaVideos: newValue,
      documents: newValue,
      conversations: newValue,
      notes: newValue,
      comments: newValue,
      members: newValue,
    };

    setBase(newValue);
    setMediaPhotos(newValue);
    setMediaVideos(newValue);
    setDocuments(newValue);
    setConversations(newValue);
    setNotes(newValue);
    setComments(newValue);
    setMembers(newValue);

    onSave(parentPerms, false);
  };

  const onChangePermNew = (
    isChecked: boolean,
    checkedValue: number,
    stateKeyType: IJobSubModuleTypes,
    stateValue: number,
    setStateValue: (value: number) => void,
    completeValue: number
  ) => {
    if (
      !!!(checkedValue & CommonPerms.all) &&
      !!(stateValue & CommonPerms.all)
    ) {
      //  If any other permission type is clicked other than all value should be removed
      stateValue = completeValue;
    }

    let newValue = stateValue;

    if (isChecked) {
      if (checkedValue & CommonPerms.all) {
        //  If checked and is all type then value can simply become CommonPerms.all
        newValue = CommonPerms.all;
      } else {
        newValue = newValue | checkedValue;
      }
    } else {
      newValue = newValue & ~checkedValue;
    }

    newValue = newValue & ~CommonPerms.none; //  This is added because none permission was always getting added to the final value
    if (newValue === 0) {
      newValue = CommonPerms.none;
    }

    setStateValue(newValue);

    //  This is done in case type is media photo, we need to update the video permission value as well, at the moment we are not showing videos separately
    if (stateKeyType === IJobSubModuleTypes.mediaPhotos) {
      setMediaVideos(newValue);
    }

    let parentPerms: IJobSubModulePerms = {
      parent,
      base,
      mediaPhotos,
      mediaVideos,
      documents,
      conversations,
      notes,
      comments,
      members,
      [stateKeyType]: newValue,
    };

    //  This is for the parent checkbox auto check and vice versa
    if (
      !(parentPerms.base & CommonPerms.all) ||
      !(parentPerms.mediaPhotos & CommonPerms.all) ||
      !(parentPerms.mediaVideos & CommonPerms.all) ||
      !(parentPerms.documents & CommonPerms.all) ||
      !(parentPerms.conversations & CommonPerms.all) ||
      !(parentPerms.notes & CommonPerms.all) ||
      !(parentPerms.comments & CommonPerms.all) ||
      !(parentPerms.members & CommonPerms.all)
    ) {
      parentPerms.parent = CommonPerms.none;
    } else {
      parentPerms.parent = CommonPerms.all;
    }

    onSave(parentPerms, false);
  };

  return (
    <div className="checkbox-list-box-wrap permission-box-shadow">
      <div className="">
        <div className="checkbox-card">
          <div className="flex-content">
            <div className="all-permission-header">
              <input
                className="styled-checkbox"
                id={`main-checkbox`}
                type="checkbox"
                checked={!!(parent & CommonPerms.all)}
                onChange={(event) => {
                  parentChange(event.target.checked);
                }}
              />
              <label htmlFor="main-checkbox" className="font-weight-bold fz-20">
                Job Permissions
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="checkbox-list-box-wrap px-3">
        <div className="checkbox-list-box">
          <h6 className="sec-title">Job Level Permissions</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div className="">
                      <input
                        className="styled-checkbox"
                        id={`job-perm-${index}`}
                        type="checkbox"
                        checked={!!(base & (subModule.value | CommonPerms.all))}
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.base,
                            base,
                            setBase,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`job-perm-${index}`}>
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Media (Photos/Videos)</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`base-${index}`}
                        type="checkbox"
                        checked={
                          !!(mediaPhotos & (subModule.value | CommonPerms.all))
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.mediaPhotos,
                            mediaPhotos,
                            setMediaPhotos,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`base-${index}`}>{subModule.label}</label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Documents</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`documents-${index}`}
                        type="checkbox"
                        checked={
                          !!(documents & (subModule.value | CommonPerms.all))
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.documents,
                            documents,
                            setDocuments,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`documents-${index}`}>
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Conversations</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`conversation-${index}`}
                        type="checkbox"
                        checked={
                          !!(
                            conversations &
                            (subModule.value | CommonPerms.all)
                          )
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.conversations,
                            conversations,
                            setConversations,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`conversation-${index}`}>
                        {' '}
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Notes</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`notes-${index}`}
                        type="checkbox"
                        checked={
                          !!(notes & (subModule.value | CommonPerms.all))
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.notes,
                            notes,
                            setNotes,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`notes-${index}`}>
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Comments</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Timeline',
                value: CommonPerms.timeline,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`comments-${index}`}
                        type="checkbox"
                        checked={
                          !!(comments & (subModule.value | CommonPerms.all))
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.comments,
                            comments,
                            setComments,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.timeline
                          );
                        }}
                      />
                      <label htmlFor={`comments-${index}`}>
                        {' '}
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkbox-list-box">
          <h6 className="sec-title">Members</h6>
          <div className="flex-space-wrap">
            {[
              {
                label: 'All',
                value: CommonPerms.all,
              },
              {
                label: 'View',
                value: CommonPerms.view,
              },
              {
                label: 'Add',
                value: CommonPerms.add,
              },
              {
                label: 'Edit',
                value: CommonPerms.edit,
              },
              {
                label: 'Delete',
                value: CommonPerms.delete,
              },
              {
                label: 'Invite',
                value: CommonPerms.invite,
              },
            ].map((subModule, index) => {
              return (
                <div className="checkbox-card" key={index}>
                  <div className="flex-content">
                    <div>
                      <input
                        className="styled-checkbox"
                        id={`members-${index}`}
                        type="checkbox"
                        checked={
                          !!(members & (CommonPerms.all | subModule.value))
                        }
                        onChange={(event) => {
                          onChangePermNew(
                            event.target.checked,
                            subModule.value,
                            IJobSubModuleTypes.members,
                            members,
                            setMembers,
                            CommonPerms.view |
                              CommonPerms.add |
                              CommonPerms.edit |
                              CommonPerms.delete |
                              CommonPerms.invite
                          );
                        }}
                      />
                      <label htmlFor={`members-${index}`}>
                        {subModule.label}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="btn-wrap d-flex d-md-none flex-column py-3">
          <button className="btn btn-primary mobile-btn mt-2">
            Save As New Role
          </button>
          <button className="btn btn-primary mobile-btn mt-2">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPermissions;
