import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { IAppReduxState } from '../../redux/reducer';

import Main from '../../components/Layouts/Main';

import { clearAllToast, infoToast } from '../../utils/toast';
import { getAuthToken } from '../../utils/common';

import { PolyfillAddIcon } from '../../components/Icons';

import JobRoutes from '../Jobs/routes';

import PropertiesRoutes from '../Properties/routes';

// import IntegrationCommonsRoutes from '../IntegrationCommons/routes';

import UserRoutes from '../Users/routes';
import UserOwnerRoutes from '../UserOwners/routes';

import InvitePopup from '../Invites/InvitePopup';

import DashboardRoutes from './routes';
import {
  DashboardUserIcon,
  DashboardJobIcon,
  PropertiesRoundedIcon,
} from './Icons';
import * as interfaces from './interfaces';
import * as constants from './constants';
import * as services from './services';

export default function DashboardHome() {
  const isMounted = useMountedState();

  const {
    auth: { product },
  } = useSelector((state: IAppReduxState) => state);

  const [dropdown, setDropdown] = useState(false);

  const [counts, setCounts] = useState<interfaces.IDashboardHomeCountData>(
    constants.defaultDashboardCount
  );

  const fetchData = async () => {
    try {
      const result = await services.dashboardHomeService();
      if (!isMounted()) {
        return;
      }

      setCounts(result);
    } catch (error) {}
  };

  useEffect(() => {
    clearAllToast();

    fetchData();

    const firstTime = localStorage.getItem('firstTime') || 'true';
    const token = getAuthToken();

    if (firstTime === 'true' && token) {
      infoToast(`Welcome to the ${product.name} dashboard`, {
        position: 'bottom-right',
      });

      localStorage.setItem('firstTime', 'false');
    }
  }, []);

  return (
    <Main sideBarId={DashboardRoutes.routes.home.sideBarId}>
      <InvitePopup />

      <div className="dashboard-wrap px-3 px-lg-0">
        <div className="main-heading-wrap flex-space-between">
          <div className="dashboard-heading-title">
            <h5 className="title">Dashboard</h5>
          </div>
          <div
            className={
              dropdown
                ? 'dropdown pl-3 button-popup-dropdown d-none d-sm-inline btn-wrap dropdown-open'
                : 'dropdown pl-3 button-popup-dropdown d-none d-sm-inline btn-wrap '
            }
          >
            <button
              className="dropdown-toggle btn btn-primary"
              onClick={() => setDropdown(!dropdown)}
            >
              <PolyfillAddIcon className="mr-2" />
              Add New
            </button>
            {dropdown ? (
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                {UserRoutes.routes.list.access && (
                  <Link
                    className="dropdown-item flex-space-between"
                    to={UserRoutes.routes.add.path}
                  >
                    User
                  </Link>
                )}

                {UserOwnerRoutes.routes.list.access && (
                  <Link
                    className="dropdown-item flex-space-between"
                    to={UserOwnerRoutes.routes.add.path}
                  >
                    Owner
                  </Link>
                )}

                {JobRoutes.routes.list.access && (
                  <Link
                    className="dropdown-item flex-space-between"
                    to={JobRoutes.routes.add.path}
                  >
                    Job
                  </Link>
                )}

                {PropertiesRoutes.routes.list.access && (
                  <Link
                    className="dropdown-item flex-space-between"
                    to={PropertiesRoutes.routes.add.path}
                  >
                    Property
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="dashboard-content-wrap">
          <div className="row">
            {UserRoutes.routes.list.access && (
              <div className="col-6 col-sm-6 col-md-4 col-lg-4 custom-col-xl-4">
                <Link
                  to={UserRoutes.routes.list.path}
                  className="flex-content card-box"
                >
                  <div className="card-image">
                    <DashboardUserIcon />
                  </div>
                  <div className="card-content">
                    <p className="sec-content">{UserRoutes.name}</p>
                    <span className="number-text">{counts.users}</span>
                  </div>
                </Link>
              </div>
            )}

            {UserOwnerRoutes.routes.list.access && (
              <div className="col-6 col-sm-6 col-md-4 col-lg-4 custom-col-xl-4">
                <Link
                  to={UserOwnerRoutes.routes.list.path}
                  className="flex-content card-box"
                >
                  <div className="card-image">
                    <DashboardUserIcon />
                  </div>
                  <div className="card-content">
                    <p className="sec-content">{UserOwnerRoutes.name}</p>
                    <span className="number-text">{counts.userOwners}</span>
                  </div>
                </Link>
              </div>
            )}

            {JobRoutes.routes.list.access && (
              <div className="col-6 col-sm-6 col-md-4 col-lg-4 custom-col-xl-4">
                <Link
                  to={JobRoutes.routes.list.path}
                  className="flex-content card-box"
                >
                  <div className="card-image">
                    <DashboardJobIcon />
                  </div>
                  <div className="card-content">
                    <p className="sec-content">{JobRoutes.name}</p>
                    <span className="number-text">{counts.jobs}</span>
                  </div>
                </Link>
              </div>
            )}

            {PropertiesRoutes.routes.list.access && (
              <div className="col-6 col-sm-6 col-md-4 col-lg-4 custom-col-xl-4">
                <Link
                  to={PropertiesRoutes.routes.list.path}
                  className="flex-content card-box"
                >
                  <div className="card-image">
                    <PropertiesRoundedIcon />
                  </div>
                  <div className="card-content">
                    <p className="sec-content">{PropertiesRoutes.name}</p>
                    <span className="number-text">{counts.properties}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* <div className="col-6 col-sm-6 col-md-4 col-lg-4 custom-col-xl-4">
              <Link
                to={IntegrationCommonsRoutes.routes.integrationCommonList.path}
                className="flex-content card-box"
              >
                <div className="card-image">
                  <PropertyTypeIcon />
                </div>
                <div className="card-content">
                  <p className="sec-content">{IntegrationCommonsRoutes.name}</p>
                  <span className="number-text">0</span>
                </div>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </Main>
  );
}
