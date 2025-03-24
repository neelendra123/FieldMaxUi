import { Fragment, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { useMountedState } from 'react-use';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { PolyfillAddIcon } from '../../../components/Icons';
import { TextInputComp } from '../../../components/Forms';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import RoleRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

export default function RolesSaveBtn({
  permissions,
  onClick,
  kind,

  disabled = false,
}: {
  permissions: IJobSubModulePerms;
  onClick?: () => void;
  kind: interfaces.IRoleKinds;

  disabled?: boolean;
}) {
  const isMounted = useMountedState();

  const [isFetching, setIsFetching] = useState(false);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    const data: interfaces.IRoleAddFormData = {
      kind,
      name,
      description: '',
      permissions,
    };

    const validate = validateData(data, constants.RoleAddJoiScheme);
    if (validate.errors?.name) {
      setErrors([validate.errors.name]);
      return;
    }

    setIsFetching(true);
    setErrors([]);

    const result = await services.rolesCreateService(data);
    if (!isMounted()) {
      return;
    }

    setOpen(false);
    setIsFetching(false);
    setName('');

    successToast(result.message);
  };

  return RoleRoutes.routes.add.access ? (
    <Fragment>
      <button
        className="btn btn-primary"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <PolyfillAddIcon className="mr-2" /> Add New Role
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        // classNames={{
        //   modalAnimationIn: 'fade',
        // modal: 'modal no-padding',
        //   overlayAnimationIn: 'fade',
        // }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Role Create</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <TextInputComp
                  type="text"
                  name="name"
                  onChange={setName}
                  label="Role Name"
                  autoFocus
                  placeholder="Role Name *"
                  value={name}
                />
                {errors.map((error, key) => (
                  <p className="text-danger" key={key}>
                    <small>{error}</small>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default pull-left"
              data-dismiss="modal"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={formSubmitted}
              disabled={isFetching}
            >
              <PolyfillAddIcon className="mr-2" /> Add New Role
            </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  ) : null;
}
