import { useState } from 'react';
import { FcNext } from 'react-icons/fc';
import { Popup } from '../../../components/Common';
import { TextInputComp } from '../../../components/Forms';
import {
  JobsRoundedIcon,
  OwnerRoundedIcon,
  PersonRoundedIcon,
  ResidentRoundedIcon,
  ShieldRoundedIcon,
} from '../../../components/Icons';

const DashboardAppearance = () => {
  const [openPopUp, setOpenPopUp] = useState(false);

  const ModulesPopUp = () => {
    return (
      <Popup
        isOpen={openPopUp}
        title={'Rename Modules'}
        hideButton={true}
        onClose={() => setOpenPopUp(false)}
        ModalName={'Rename Modules'}
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        // disableButtons={isCreating}
        // onSave={onSave}
      >
        <div className="text-left">
          <div>
            <div className="d-flex">
              <div className="d-flex align-items-center w-100 my-2">
                <ShieldRoundedIcon />
                <TextInputComp
                  name=""
                  value="Accounts"
                  className="form-control form-control-sm ml-3 flex-grow-1"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex align-items-center w-100 my-2">
                <PersonRoundedIcon />
                <TextInputComp
                  name=""
                  value="Users"
                  className="form-control form-control-sm ml-3 flex-grow-1"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex align-items-center w-100 my-2">
                <OwnerRoundedIcon />
                <TextInputComp
                  name=""
                  value="Owner"
                  className="form-control form-control-sm ml-3 flex-grow-1"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex align-items-center w-100 my-2">
                <ResidentRoundedIcon />
                <TextInputComp
                  name=""
                  value="Residents"
                  className="form-control form-control-sm ml-3 flex-grow-1"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex align-items-center w-100 my-2">
                <JobsRoundedIcon />
                <TextInputComp
                  name=""
                  value="Jobs"
                  className="form-control form-control-sm ml-3 flex-grow-1"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div>
              <button className="btn btn-primary w-100 mt-2">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <div>
      <ModulesPopUp />
      <div className="card mt-5 p-3 rounded equal-shadow">
        <div
          className="d-flex px-3 py-4 justify-content-between align-items-center border-bottom c-pointer"
          onClick={(e) => setOpenPopUp(true)}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Rename modules</h6>
          <FcNext className="fz-20" />
        </div>
        <div className="d-flex px-3 py-4 justify-content-between align-items-center border-bottom">
          <p className="fz-18 mb-0 font-weight-bold">Option 1</p>
          <FcNext className="fz-20" />
        </div>

        <div className="d-flex px-3 py-4  justify-content-between align-items-center ">
          <h6 className="fz-18 mb-0 font-weight-bold">Option 2</h6>
          <FcNext className="fz-20" />
        </div>
      </div>
    </div>
  );
};

export default DashboardAppearance;
