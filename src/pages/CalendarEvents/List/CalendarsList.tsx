import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useMountedState } from 'react-use';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';

import CalendarEventRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as services from '../services';
import * as utils from '../utils';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
//@ts-ignore
const allViews = Object.keys(Views).map((k) => Views[k]);

// const Event = ({ event }: { event: any }) => {
//   return (
//     <span>
//       <strong>{event.name}</strong>
//       {event.description && ':  ' + event.description}
//     </span>
//   );
// };

// function EventAgenda({ event }: { event: any }) {
//   return (
//     <span>
//       <em>{event.name}</em>
//       <p>{event.description}</p>
//     </span>
//   );
// }

export default function CalendarsList() {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [list, setList] = useState<interfaces.ICalendarEventTypes[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const list = await services.calendarEventsListService();
      if (!isMounted()) {
        return;
      }

      setList(utils.parseCalendarEvents(list));
    } catch (error) {}

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  return (
    <Main sideBarId={CalendarEventRoutes.routes.list.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">Calendar</h5>
          </div>
        </div>

        <Calendar
          popup
          events={list}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView={Views.MONTH}
          views={allViews}
          style={{ height: 700 }}
          eventPropGetter={(event) => {
            return {
              style: {
                backgroundColor: event.color,
              },
            };
          }}
          onSelectEvent={(event) => {
            if (event.redirectionPath) {
              history.push(event.redirectionPath);
            }
          }}
          showMultiDayTimes
        />
      </div>
    </Main>
  );
}
