import { Fragment, useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';

import 'bootstrap-daterangepicker/daterangepicker.css';

function DtRange({
  format = 'YYYY-MM-DD hh:mm A',
  timePicker = false,

  startDt = moment().subtract(60, 'days').startOf('day').utc().format(),
  //new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  // endDt = new Date().toISOString(),
  endDt = moment().endOf('day').utc().format(),

  onChange,
}: {
  format?: 'YYYY-MM-DD hh:mm A' | 'YYYY-MM-DD';
  timePicker?: boolean;

  startDt?: string;
  endDt?: string;

  onChange: (startDt: string, endDt: string) => void;
}) {
  const [startDtFilter, setStartDtFilter] = useState<string>(startDt);
  const [endDtFilter, setEndDtFilter] = useState<string>(endDt);

  useEffect(() => {
    onChange(startDtFilter, endDtFilter);

    // logInfo({
    //   startDtFilter,
    //   endDtFilter
    // });
  }, []);

  return (
    <Fragment>
      <label>Start & End Date</label>
      <DateRangePicker
        initialSettings={{
          timePicker,
          startDate: startDtFilter,
          endDate: endDtFilter,
          locale: {
            format,
          },
        }}
        onCallback={(start, end) => {
          const startDt = timePicker
            ? start.utc().format()
            : start.startOf('day').utc().format();

          const endDt = timePicker
            ? end.utc().format()
            : end.endOf('day').utc().format();

          setStartDtFilter(startDt);
          setEndDtFilter(endDt);

          onChange(startDt, endDt);

          // logInfo({
          //   startDt,
          //   endDt
          // });
        }}
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
    </Fragment>
  );
}

export default DtRange;
