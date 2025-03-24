import { Fragment, useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';

import 'bootstrap-daterangepicker/daterangepicker.css';

const format = 'YYYY-MM-DD';
// const format = 'YYYY-MM-DD hh:mm A';

const DatePicker = ({
  label = 'Date',

  dt,

  minDt = '',
  maxDt = '', // moment().endOf('day').utc().format(),

  onChange,
}: {
  label?: string;

  dt?: string;

  minDt?: string;
  maxDt?: string;

  onChange: (dt: string) => void;
}) => {
  const [dtValue, setDtValue] = useState(
    dt ? moment(dt).format(format) : moment().startOf('day').format(format)
  );

  useEffect(() => {
    onChange(dtValue);
  }, [dtValue]);

  return (
    <Fragment>
      <label>{label}</label>
      <DateRangePicker
        initialSettings={{
          singleDatePicker: true,
          showDropdowns: true,
          startDate: dtValue,
          locale: {
            format,
          },
          minDate: { minDt },
          // minYear: 2000,
          // maxYear: parseInt(moment().format('YYYY'), 10),
        }}
        onCallback={(start) => {
          // const startDtFull = start.startOf('day').utc().format();
          const startDtFull = start.startOf('day').format();
          // const startDt = moment(start).format(format);

          setDtValue(startDtFull);
        }}
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
    </Fragment>
  );
};

export default DatePicker;
// export default memo(DatePicker);
