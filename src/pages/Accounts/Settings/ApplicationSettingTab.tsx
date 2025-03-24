import { BiCheck } from 'react-icons/bi';

const ApplicationSettingTab = () => {
  return (
    <div>
      <div className="card mt-5 rounded equal-shadow">
        <div className="card-body bg-white">
          <h6>Notification Preferences</h6>

          <div className="user-permission mt-4">
            <p>Users</p>
            <div className="grid-mobile">
              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                All
              </div>

              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                Cristopher
              </div>

              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                Nathalie
              </div>

              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                Cristopher
              </div>

              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                Silicon
              </div>

              <div className="max-checkbox fs-12">
                <div className="check">
                  <BiCheck className="fs-18" />
                </div>
                Nathalie
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettingTab;
