import { Fragment } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';

function DtRangeFilters({
  label = 'Start & End Date',

  drops = 'up',
  opens = 'center',

  format = 'YYYY-MM-DD hh:mm A',
  timePicker = false,

  startDt = moment().subtract(60, 'days').startOf('day').utc().format(),
  //new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  // endDt = new Date().toISOString(),
  endDt = moment().endOf('day').utc().format(),

  maxDate,

  onChange,

  errorMsg,
  showDropdowns = true,
}: {
  label?: string;

  drops?: 'down' | 'up' | 'auto';
  opens?: 'left' | 'right' | 'center';

  format?: 'YYYY-MM-DD hh:mm A' | 'YYYY-MM-DD' | string;
  timePicker?: boolean;

  startDt?: string;
  endDt?: string;

  maxDate?: any;

  onChange: (startDt: string, endDt: string) => void;

  errorMsg?: string;
  showDropdowns?: boolean
}) {
  // const [startDtFilter, setStartDtFilter] = useState(startDt);
  // const [endDtFilter, setEndDtFilter] = useState(endDt);

  // useEffect(() => {
  //   console.log({
  //     drops,
  //   });
  //   // onChange(startDtFilter, endDtFilter);
  // }, []);

  //https://www.daterangepicker.com/#options
  return (
    <Fragment>
      {label !== '' ? <label>{label}</label> : null}

      <DateRangePicker
        initialSettings={{
          timePicker,
          startDate: startDt,
          endDate: endDt,
          locale: {
            format,
          },
          opens,
          drops,

          maxDate,
          showDropdowns
          // autoApply: true,
        }}
        // onShow={(event, picker) => {
        //   console.log({
        //     picker,
        //   });
        // }}
        onCallback={(start, end) => {
          const startDt = timePicker
            ? start.utc().format()
            : start.startOf('day').utc().format();

          const endDt = timePicker
            ? end.utc().format()
            : end.endOf('day').utc().format();

          // setStartDt(startDt);
          // setEndDtFilter(endDt);

          onChange(startDt, endDt);

          // console.log({
          //   start,
          //   startDt,
          //   end,
          //   endDt,
          // });
        }}
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
      {!!errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
    </Fragment>
  );
}

export default DtRangeFilters;
