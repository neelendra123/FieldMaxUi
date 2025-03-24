import { useState, memo, Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import { CommonPerms } from '../../../constants';
import { IModuleKind } from '../../../interfaces';

import {
  IJobSubModuleTypes,
  IUserSubModuleTypes,
  IUserOwnerSubModuleTypes,
  IPropertySubModuleTypes,
  IResidentSubModuleTypes,
  IRoleSubModuleTypes,
  IIntegrationCommonSubModuleTypes,
  IOrgPerms,
} from '../../Orgs/interfaces';

const UserPermissions = ({
  permissions,
  setPermissions,
}: {
  permissions: IOrgPerms;
  setPermissions: (perms: IOrgPerms) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string>(IModuleKind.jobs);

  const onChangeSubModulePerm = (
    moduleKind: IModuleKind,
    subModuleType:
      | IJobSubModuleTypes
      | IUserSubModuleTypes
      | IUserOwnerSubModuleTypes
      | IPropertySubModuleTypes
      | IResidentSubModuleTypes
      | IRoleSubModuleTypes,
    permVal: number
  ) => {
    let isChecked: boolean;

    //@ts-ignore
    let currentSubModulePerm: number = permissions[moduleKind][subModuleType];

    // let currentSubModulePerm = jobPerms[subModuleType];

    if (currentSubModulePerm & permVal) {
      isChecked = false;
    } else {
      isChecked = true;
    }

    if (isChecked) {
      if (permVal & CommonPerms.all) {
        //  If checked and is all type then value can simply become CommonPerms.all
        currentSubModulePerm = CommonPerms.all;
      } else {
        currentSubModulePerm = currentSubModulePerm | permVal;
      }
    } else {
      currentSubModulePerm = currentSubModulePerm & ~permVal;
    }

    currentSubModulePerm = currentSubModulePerm & ~CommonPerms.none; //  This is added because none permission was always getting added to the final value
    if (currentSubModulePerm === 0) {
      currentSubModulePerm = CommonPerms.none;
    }

    let newPermissions = {
      ...permissions,
      [moduleKind]: {
        ...permissions[moduleKind],
        [subModuleType]: currentSubModulePerm,
      },
    };

    //  This is a by pass for Videos because we dont show video seperately.
    //  When MediaPhotos perm is changed we change the MediaVideo perm as well
    if (
      moduleKind === IModuleKind.jobs &&
      subModuleType === IJobSubModuleTypes.mediaPhotos
    ) {
      newPermissions.jobs.mediaVideos = currentSubModulePerm;
    }

    setPermissions(newPermissions);
  };

  const JobSubModulePerms = () => {
    const moduleKind = IModuleKind.jobs;
    const { base, mediaPhotos, documents, notes, conversations, comments } =
      permissions[moduleKind];

    return (
      <Fragment>
        {/* Job */}
        <div className="user-permission">
          <p>Job</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
        {/* Media Photos, Videos */}
        <div className="user-permission">
          <p>Media (Photos/Videos)</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.all
                  )
                }
              >
                {!!(mediaPhotos & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.view
                  )
                }
              >
                {!!(mediaPhotos & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.add
                  )
                }
              >
                {!!(mediaPhotos & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.edit
                  )
                }
              >
                {!!(mediaPhotos & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.delete
                  )
                }
              >
                {!!(mediaPhotos & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.mediaPhotos,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(mediaPhotos & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
        {/* Documents */}
        <div className="user-permission">
          <p>Documents</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.all
                  )
                }
              >
                {!!(documents & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.view
                  )
                }
              >
                {!!(documents & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.add
                  )
                }
              >
                {!!(documents & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.edit
                  )
                }
              >
                {!!(documents & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.delete
                  )
                }
              >
                {!!(documents & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.documents,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(documents & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
        {/* Notes */}
        <div className="user-permission">
          <p>Notes</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.all
                  )
                }
              >
                {!!(notes & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.view
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.add
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.edit
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.delete
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.notes,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
        {/* Conversations */}
        <div className="user-permission">
          <p>Conversations</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.all
                  )
                }
              >
                {!!(conversations & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.view
                  )
                }
              >
                {!!(conversations & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.add
                  )
                }
              >
                {!!(conversations & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.edit
                  )
                }
              >
                {!!(conversations & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.delete
                  )
                }
              >
                {!!(conversations & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.conversations,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(
                  conversations &
                  (CommonPerms.all | CommonPerms.timeline)
                ) && <BiCheck className="fs-18" />}
              </div>
              Timeline
            </div>
          </div>
        </div>
        {/* Comments */}
        <div className="user-permission">
          <p>Comments</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.all
                  )
                }
              >
                {!!(comments & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.view
                  )
                }
              >
                {!!(comments & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.add
                  )
                }
              >
                {!!(comments & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.edit
                  )
                }
              >
                {!!(comments & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.delete
                  )
                }
              >
                {!!(comments & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.comments,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(comments & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const PropertiesSubModulePerms = () => {
    const moduleKind = IModuleKind.properties;
    const {
      base,
      generalInfo,
      userOwners,
      propertyUnits,
      jobs,
      notes,
      access,
      integrations,
    } = permissions[moduleKind];

    return (
      <Fragment>
        {/* Base */}
        <div className="user-permission">
          <p>Property</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>

        {/* General Info Tab */}
        <div className="user-permission">
          <p>General Info</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.generalInfo,
                    CommonPerms.all
                  )
                }
              >
                {!!(generalInfo & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.generalInfo,
                    CommonPerms.view
                  )
                }
              >
                {!!(generalInfo & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.generalInfo,
                    CommonPerms.edit
                  )
                }
              >
                {!!(generalInfo & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* User Owners Tab */}
        <div className="user-permission">
          <p>Owners</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.userOwners,
                    CommonPerms.all
                  )
                }
              >
                {!!(userOwners & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.userOwners,
                    CommonPerms.view
                  )
                }
              >
                {!!(userOwners & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.userOwners,
                    CommonPerms.edit
                  )
                }
              >
                {!!(userOwners & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* User Owners Tab */}
        <div className="user-permission">
          <p>Properties</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.propertyUnits,
                    CommonPerms.all
                  )
                }
              >
                {!!(propertyUnits & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.propertyUnits,
                    CommonPerms.view
                  )
                }
              >
                {!!(propertyUnits & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.propertyUnits,
                    CommonPerms.edit
                  )
                }
              >
                {!!(propertyUnits & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Jobs Tab */}
        <div className="user-permission">
          <p>Jobs</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.jobs,
                    CommonPerms.all
                  )
                }
              >
                {!!(jobs & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.jobs,
                    CommonPerms.view
                  )
                }
              >
                {!!(jobs & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.jobs,
                    CommonPerms.edit
                  )
                }
              >
                {!!(jobs & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Notes & History Tab */}
        <div className="user-permission">
          <p>Notes & History</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.all
                  )
                }
              >
                {!!(notes & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.view
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.add
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.edit
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.delete
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.notes,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>

        {/* Access Tab */}
        <div className="user-permission">
          <p>Access</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.access,
                    CommonPerms.all
                  )
                }
              >
                {!!(access & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.access,
                    CommonPerms.view
                  )
                }
              >
                {!!(access & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.access,
                    CommonPerms.edit
                  )
                }
              >
                {!!(access & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="user-permission">
          <p>Integrations</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.integrations,
                    CommonPerms.all
                  )
                }
              >
                {!!(integrations & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.integrations,
                    CommonPerms.view
                  )
                }
              >
                {!!(integrations & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IPropertySubModuleTypes.integrations,
                    CommonPerms.edit
                  )
                }
              >
                {!!(integrations & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const UserSubModulePerms = () => {
    const moduleKind = IModuleKind.users;
    const { base } = permissions[moduleKind];

    return (
      <Fragment>
        {/* Base */}
        <div className="user-permission">
          <p>User</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserSubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const UserOwnerSubModulePerms = () => {
    const moduleKind = IModuleKind.userOwners;
    const { base, generalInfo, properties, notes, access, integrations } =
      permissions[moduleKind];

    return (
      <Fragment>
        {/* Base */}
        <div className="user-permission">
          <p>Owner</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>

        {/* General Info Tab */}
        <div className="user-permission">
          <p>General Info</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.generalInfo,
                    CommonPerms.all
                  )
                }
              >
                {!!(generalInfo & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.generalInfo,
                    CommonPerms.view
                  )
                }
              >
                {!!(generalInfo & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.generalInfo,
                    CommonPerms.edit
                  )
                }
              >
                {!!(generalInfo & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Properties Tab */}
        <div className="user-permission">
          <p>Properties</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.properties,
                    CommonPerms.all
                  )
                }
              >
                {!!(properties & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.properties,
                    CommonPerms.view
                  )
                }
              >
                {!!(properties & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.properties,
                    CommonPerms.edit
                  )
                }
              >
                {!!(properties & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Notes & History Tab */}
        <div className="user-permission">
          <p>Notes & History</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.all
                  )
                }
              >
                {!!(notes & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.view
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.add
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.edit
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.delete
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.notes,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(notes & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>

        {/* Access Tab */}
        <div className="user-permission">
          <p>Access</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.access,
                    CommonPerms.all
                  )
                }
              >
                {!!(access & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.access,
                    CommonPerms.view
                  )
                }
              >
                {!!(access & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.access,
                    CommonPerms.edit
                  )
                }
              >
                {!!(access & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="user-permission">
          <p>Integrations</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.integrations,
                    CommonPerms.all
                  )
                }
              >
                {!!(integrations & CommonPerms.all) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.integrations,
                    CommonPerms.view
                  )
                }
              >
                {!!(integrations & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IUserOwnerSubModuleTypes.integrations,
                    CommonPerms.edit
                  )
                }
              >
                {!!(integrations & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const ResidentSubModulePerms = () => {
    const moduleKind = IModuleKind.residents;
    const { base } = permissions[moduleKind];

    return (
      <Fragment>
        {/* Base */}
        <div className="user-permission">
          <p>Resident</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IResidentSubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const RoleSubModulePerms = () => {
    const moduleKind = IModuleKind.roles;
    const { base } = permissions[moduleKind];

    return (
      <Fragment>
        {/* Base */}
        <div className="user-permission">
          <p>Role</p>
          <div className="grid-mobile border-bottom">
            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IRoleSubModuleTypes.base,
                    CommonPerms.all
                  )
                }
              >
                {!!(base & CommonPerms.all) && <BiCheck className="fs-18" />}
              </div>
              All
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.view
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.view)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              View
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.add
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.add)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Add
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.edit
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.edit)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Edit
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.delete
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.delete)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Delete
            </div>

            <div className="max-checkbox fs-12">
              <div
                className="check"
                onClick={(e) =>
                  onChangeSubModulePerm(
                    moduleKind,
                    IJobSubModuleTypes.base,
                    CommonPerms.timeline
                  )
                }
              >
                {!!(base & (CommonPerms.all | CommonPerms.timeline)) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              Timeline
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const IntegrationCommonSubModulePerms = () => {
    const onChangePermNew = (
      isChecked: boolean,
      checkedValue: number,
      stateKeyType: IIntegrationCommonSubModuleTypes,
      stateValue: number,
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

      let newPermissions: IOrgPerms = {
        ...permissions,
        integrationCommons: {
          ...permissions.integrationCommons,
          [stateKeyType]: newValue,
        },
      };
      setPermissions(newPermissions);
    };

    const CheckboxTypes = [
      {
        label: 'All',
        value: CommonPerms.all,
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
    ];

    return (
      <Fragment>
        {/* Property Types */}
        <div className="user-permission">
          <p>Property Types</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`propertyType-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons.propertyTypes &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.propertyTypes,
                          permissions.integrationCommons.propertyTypes,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`propertyType-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Charge Types */}
        <div className="user-permission">
          <p>Charge Types</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`chargeType-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons.chargeTypes &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.chargeTypes,
                          permissions.integrationCommons.chargeTypes,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`chargeType-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Unit Types */}
        <div className="user-permission">
          <p>Unit Types</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`unitTypes-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons.unitTypes &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.unitTypes,
                          permissions.integrationCommons.unitTypes,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`unitTypes-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Service Manager Categories */}
        <div className="user-permission">
          <p>Categories</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`serviceManagerCategories-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons
                            .serviceManagerCategories &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.serviceManagerCategories,
                          permissions.integrationCommons
                            .serviceManagerCategories,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`serviceManagerCategories-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Service Manager Priorities */}
        <div className="user-permission">
          <p>Priorities</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`serviceManagerPriorities-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons
                            .serviceManagerPriorities &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.serviceManagerPriorities,
                          permissions.integrationCommons
                            .serviceManagerPriorities,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`serviceManagerPriorities-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Service Manager Statuses */}
        <div className="user-permission">
          <p>Statuses</p>
          <div className="grid-mobile border-bottom">
            {CheckboxTypes.map((subModule, index) => {
              return (
                <div
                  className="max-checkbox fs-12"
                  key={`${subModule}-${index}`}
                >
                  <div className="">
                    <input
                      className="styled-checkbox"
                      id={`serviceManagerStatuses-${index}`}
                      type="checkbox"
                      checked={
                        !!(
                          permissions.integrationCommons
                            .serviceManagerStatuses &
                          (subModule.value | CommonPerms.all)
                        )
                      }
                      onChange={(event) => {
                        onChangePermNew(
                          event.target.checked,
                          subModule.value,
                          IIntegrationCommonSubModuleTypes.serviceManagerStatuses,
                          permissions.integrationCommons.serviceManagerStatuses,
                          CommonPerms.add |
                            CommonPerms.edit |
                            CommonPerms.delete
                        );
                      }}
                    />
                    <label htmlFor={`serviceManagerStatuses-${index}`}>
                      {subModule.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <>
      <div className="grid-mobile-head flex-wrap">
        {/* This is Tabs Listing on Top */}
        <Fragment>
          <div
            onClick={() => setActiveTab(IModuleKind.jobs)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.jobs ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Jobs</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.properties)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.properties ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Properties</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.users)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.users ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Users</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.userOwners)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.userOwners ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Owners</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.residents)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.residents ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Residents</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.roles)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.roles ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Roles</h6>
          </div>

          <div
            onClick={() => setActiveTab(IModuleKind.integrationCommons)}
            className={`max-checkbox mr-2 c-pointer ${
              activeTab === IModuleKind.integrationCommons ? 'active-check' : ''
            }`}
          >
            <div className="check">
              <BiCheck />
            </div>
            <h6 className="check-h-text">Globals</h6>
          </div>
        </Fragment>
      </div>

      {activeTab === IModuleKind.jobs && <JobSubModulePerms />}
      {activeTab === IModuleKind.users && <UserSubModulePerms />}
      {activeTab === IModuleKind.userOwners && <UserOwnerSubModulePerms />}
      {activeTab === IModuleKind.properties && <PropertiesSubModulePerms />}
      {activeTab === IModuleKind.residents && <ResidentSubModulePerms />}
      {activeTab === IModuleKind.roles && <RoleSubModulePerms />}
      {activeTab === IModuleKind.integrationCommons && (
        <IntegrationCommonSubModulePerms />
      )}
      <br />
    </>
  );
};

//  This memo is added to prevent rerendering of this component even when the permissions is not updated.
export default memo(UserPermissions);
