import { useEffect, useState } from 'react';
import { useMountedState } from 'react-use';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { IAppReduxState } from '../../../redux/reducer';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';

import SettingsRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as services from '../services';

import ApplicationSettingTab from './ApplicationSettingTab';
import IntegerationTab from './IntegerationsTab';
import PropertyManagementTab from './PropertyManagementTab';
import DashboardAppearance from './DashboardAppreance';
import JobManagementTab from './JobManagementTab';

export default function Settings() {
  const isMounted = useMountedState();
  const params: { accountIndex: string } = useParams();
  const { hash } = useLocation();
  //Redux
  const { authUser } = useSelector((state: IAppReduxState) => state.auth);

  const [isLoaded, setIsLoaded] = useState(false);

  // const [baseAccount] = useState<IAuthPrimaryUserPopulate>(
  //   authUser.accounts[parseInt(params.accountIndex)].primaryUserId
  // );

  const [activeTab, setActiveTab] = useState<interfaces.ISettingsTabsType>(
    (hash?.substring(1) as interfaces.ISettingsTabsType) ||
      interfaces.ISettingsTabsType.applications
  );

  const [account, setAccount] = useState<interfaces.IAccountDetails>();

  const fetchData = async () => {
    setIsLoaded(false);
    try {
      const accountId =
        authUser.accounts[parseInt(params.accountIndex)].primaryUserId.id;

      const result = await services.accountDetailsService(accountId);
      if (!isMounted()) {
        return;
      }

      setAccount(result);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  useEffect(() => {
    //  If there is no hash in the route, then adding it.
    if (!hash?.substring(1)) {
      window.history.pushState(
        '',
        '',
        `#${interfaces.ISettingsTabsType.applications}`
      );
    }

    fetchData();
  }, []);

  return (
    <Main sideBarId={SettingsRoutes.routes.settings.sideBarId}>
      {!isLoaded && <IsFetching />}

      <div className="p-4">
        <h6>Settings</h6>

        <div className="d-flex overflow-auto flex-nowwrap mt-3">
          <div
            onClick={() => {
              setActiveTab(interfaces.ISettingsTabsType.applications);
              window.history.pushState(
                '',
                '',
                `#${interfaces.ISettingsTabsType.applications}`
              );
            }}
            className={`mr-4 mt-3 c-pointer ${
              activeTab === interfaces.ISettingsTabsType.applications
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="fz-14 mb-1 font-weight-bold">
              Application Settings
            </h6>
          </div>

          <div
            onClick={() => {
              setActiveTab(interfaces.ISettingsTabsType.integrations);
              window.history.pushState(
                '',
                '',
                `#${interfaces.ISettingsTabsType.integrations}`
              );
            }}
            className={`mr-4 mt-3 c-pointer ${
              activeTab === interfaces.ISettingsTabsType.integrations
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="fz-14 mb-1 font-weight-bold">Integrations</h6>
          </div>

          <div
            onClick={() => {
              setActiveTab(interfaces.ISettingsTabsType.properties);

              window.history.pushState(
                '',
                '',
                `#${interfaces.ISettingsTabsType.properties}`
              );
            }}
            className={`mr-4 mt-3 c-pointer ${
              activeTab === interfaces.ISettingsTabsType.properties
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="fz-14 mb-1 font-weight-bold">Property Settings</h6>
          </div>

          <div
            onClick={() => {
              setActiveTab(interfaces.ISettingsTabsType.dashboard);
              window.history.pushState(
                '',
                '',
                `#${interfaces.ISettingsTabsType.dashboard}`
              );
            }}
            className={`mr-4 mt-3 c-pointer ${
              activeTab === interfaces.ISettingsTabsType.dashboard
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="fz-14 mb-1 font-weight-bold">Dashboard Settings</h6>
          </div>

          <div
            onClick={() => {
              setActiveTab(interfaces.ISettingsTabsType.jobs);
              window.history.pushState(
                '',
                '',
                `#${interfaces.ISettingsTabsType.jobs}`
              );
            }}
            className={`mr-4 mt-3 c-pointer ${
              activeTab === interfaces.ISettingsTabsType.jobs
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="fz-14 mb-1 font-weight-bold">Job Settings</h6>
          </div>
        </div>

        {activeTab === interfaces.ISettingsTabsType.applications && (
          <ApplicationSettingTab />
        )}
        {activeTab === interfaces.ISettingsTabsType.integrations && account && (
          <IntegerationTab account={account} setAccount={setAccount} />
        )}
        {activeTab === interfaces.ISettingsTabsType.properties && (
          <PropertyManagementTab />
        )}
        {activeTab === interfaces.ISettingsTabsType.dashboard && (
          <DashboardAppearance />
        )}
        {activeTab === interfaces.ISettingsTabsType.jobs && (
          <JobManagementTab />
        )}
      </div>
    </Main>
  );
}
