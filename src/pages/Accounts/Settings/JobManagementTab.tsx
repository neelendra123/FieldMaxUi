import { DatePicker } from '../../../components/Common';
import { SelectInputComp } from '../../../components/Forms';

const JobManagementTab = () => {
  return (
    <div>
      <div className="card mt-5 rounded equal-shadow">
        <div className="card-body bg-white">
          <h6>Default Call Duration</h6>

          <div className="row">
            <div className="col-md-6 position-relative">
              <DatePicker label="Start Date" onChange={() => {}} />
            </div>

            <div className="col-md-6 position-relative">
              <DatePicker label="End Date" onChange={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-5 rounded equal-shadow ">
        <div className="card-body bg-white">
          <h6>Default Job Members</h6>

          <div className="row">
            <div className="col-md-12 mt-2">
              <label>Selected Job Members</label>
              <SelectInputComp
                label="Start Date"
                value={''}
                placeholder=""
                options={[]}
                name={''}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobManagementTab;
