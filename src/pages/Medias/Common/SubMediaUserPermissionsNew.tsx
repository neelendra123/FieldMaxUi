import { Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import { CommonPerms } from '../../../constants';
import { generateUniqueId } from '../../../utils/common';

import * as interfaces from '../interfaces';
import * as utils from '../utils';

const SubMediaUserPermissionsNew = ({
  mediaKind,
  permissions = utils.generateDefaultSubMediaPerm(),
  onSave,
}: {
  mediaKind: interfaces.IMediaKind;

  permissions: interfaces.ISubMediaUserPerms;

  onSave: (perms: interfaces.ISubMediaUserPerms) => void;
}) => {
  const { parent, base, comments, members } = permissions;

  const onChangeSubModulePerm = (
    subMediaUserPermType: interfaces.ISubMediaUserPermTypes,
    permVal: number
  ) => {
    let isChecked: boolean;

    let currentSubModulePerm: number = permissions[subMediaUserPermType];

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
      [subMediaUserPermType]: currentSubModulePerm,
    };

    if (subMediaUserPermType === interfaces.ISubMediaUserPermTypes.parent) {
      //  If parent checkbox is updated then needs to change other permissions of sub media

      //  This is added so all permissions on parent are updated to parent value onlt only the single keyType
      newPermissions = {
        parent: permVal,
        base: permVal,
        comments: permVal,
        members: permVal,
      };
    }

    onSave(newPermissions);
  };

  return (
    <div className=" p-2 active-table-tab" key={generateUniqueId()}>
      {/* <div
        className="max-checkbox mt-3"
        style={{ fontSize: 14, fontWeight: 'bold' }}
      >
        <div
          className="check"
          onClick={(e) =>
            onChangeSubModulePerm(
              interfaces.ISubMediaUserPermTypes.parent,
              !!(parent & CommonPerms.all) ? CommonPerms.none : CommonPerms.all
            )
          }
        >
          {!!(parent & CommonPerms.all) && <BiCheck className="fs-18" />}
        </div>
        All Permissions
      </div> */}

      <div className="user-permission">
        <p>
          {(mediaKind === interfaces.IMediaKind.JobVideo ||
            mediaKind === interfaces.IMediaKind.Video) && (
            <Fragment>Video</Fragment>
          )}
          {(mediaKind === interfaces.IMediaKind.JobDoc ||
            mediaKind === interfaces.IMediaKind.Doc) && (
            <Fragment>Document</Fragment>
          )}{' '}
          {(mediaKind === interfaces.IMediaKind.JobPhoto ||
            mediaKind === interfaces.IMediaKind.Photo) && (
            <Fragment>Photo</Fragment>
          )}{' '}
          Permissions
        </p>
        <div className="grid-mobile">
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
          ].map(({ value, label }, index) => {
            return (
              <div className="max-checkbox fs-12" key={index}>
                <div
                  className="check"
                  onClick={(e) =>
                    onChangeSubModulePerm(
                      interfaces.ISubMediaUserPermTypes.base,
                      value
                    )
                  }
                >
                  {!!(base & (CommonPerms.all | value)) && (
                    <BiCheck className="fs-18" />
                  )}
                </div>
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="user-permission">
        <p>Comments</p>
        <div className="grid-mobile">
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
          ].map(({ value, label }, index) => {
            return (
              <div className="max-checkbox fs-12" key={index}>
                <div
                  className="check"
                  onClick={(e) =>
                    onChangeSubModulePerm(
                      interfaces.ISubMediaUserPermTypes.comments,
                      value
                    )
                  }
                >
                  {!!(comments & (CommonPerms.all | value)) && (
                    <BiCheck className="fs-18" />
                  )}
                </div>
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="user-permission">
        <p>Members</p>
        <div className="grid-mobile">
          {[
            {
              label: 'All',
              value: CommonPerms.all,
            },
            {
              label: 'View',
              value: CommonPerms.view,
            },
            // {
            //   label: 'Add',
            //   value: CommonPerms.add,
            // },
            {
              label: 'Edit',
              value: CommonPerms.edit,
            },
            // {
            //   label: 'Delete',
            //   value: CommonPerms.delete,
            // },
            // {
            //   label: 'Timeline',
            //   value: CommonPerms.timeline,
            // },
          ].map(({ value, label }, index) => {
            return (
              <div className="max-checkbox fs-12" key={index}>
                <div
                  className="check"
                  onClick={(e) =>
                    onChangeSubModulePerm(
                      interfaces.ISubMediaUserPermTypes.members,
                      value
                    )
                  }
                >
                  {!!(members & (CommonPerms.all | value)) && (
                    <BiCheck className="fs-18" />
                  )}
                </div>
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubMediaUserPermissionsNew;
