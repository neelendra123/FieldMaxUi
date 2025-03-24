import { useEffect, useState, Fragment } from 'react';
import { useMountedState } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';

import { IAppReduxState } from '../../../redux/reducer';
import { notificationsUpdateAction } from '../../../redux/notifications/notifications.actions';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';
import {
  Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';

import NotificationRow from '../Common/NotificationRow';

import NotificationRoutes from '../routes';

import * as interfaces from '../interfaces';
import * as services from '../services';

const Notifications = () => {
  const isMounted = useMountedState();

  const {
    auth: { accountIndex },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState<interfaces.INotification[]>([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const result = await services.notificationsListService({
        skip: (page - 1) * perPage,
        limit: perPage,
      });
      if (!isMounted()) {
        return;
      }

      if (page === 1) {
        //  Updating the notifications redux state for the current selected account, in case on the first page.
        reduxActionDispatch(
          notificationsUpdateAction({
            accountIndex,
            notificationData: result,
          })
        );
      }

      setRows(result.records);
      setTotalRows(result.count);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  return (
    <Main sideBarId={NotificationRoutes.routes.list.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="px-4">
        <h6>Notifications</h6>
        {rows.map((record) => (
          <Fragment key={record.id}>
            <NotificationRow full record={record} />
          </Fragment>
        ))}
      </div>

      {!isFetching && (
        <Pagination
          totalRows={totalRows}
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      )}
    </Main>
  );
};

export default Notifications;
