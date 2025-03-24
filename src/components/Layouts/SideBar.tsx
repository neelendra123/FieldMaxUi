import { Link } from 'react-router-dom';

import { IProductDetails } from '../../interfaces';

import DashboardRoutes from '../../pages/Dashboard/routes';

import JobRoutes from '../../pages/Jobs/routes';

import PropertiesRoutes from '../../pages/Properties/routes';

import IntegrationCommonsRoutes from '../../pages/IntegrationCommons/routes';

import UserRoutes from '../../pages/Users/routes';
import UserOwnerRoutes from '../../pages/UserOwners/routes';

import AccountsRoutes from '../../pages/Accounts/routes';

import {
  DashboardIcon,
  JobIcon,
  PropertyIcon,
  UserIcon,
  PropertiesIcon,
  OwnerIcon,
  SettingIcon,
} from '../../components/Icons';

import { IAuthUser } from '../../pages/Auth/interfaces';
import { generateDynamicPath } from '../../utils/common';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Data } from '@react-google-maps/api';

function isActiveClass(
  currentSideBarId: number,
  currentId: number
  // isParent: boolean = false
) {
  let className = '';

  // if (isParent) {
  currentId = Math.floor(currentId);
  currentSideBarId = Math.floor(currentSideBarId);
  // }

  if (currentId === currentSideBarId) {
    className = 'active';
  }

  return className;
}

interface SideBarProps {
  sideBar: string;

  user: IAuthUser;
  sideBarId: number;
  productDetails: IProductDetails;

  activeAccountIndex: number;
}

function Sidebar({
  sideBarId,
  productDetails,

  sideBar,

  activeAccountIndex,
}: SideBarProps) {
  const [sideBarLocal, setSideBar] = useState(
    localStorage.getItem('sideBar') || 'min'
  );
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const toggleSideBar = () => {
    //const value = sideBarLocal === 'min' ? 'max' : 'min';
    const _data = isMobile?"min":"max";
    const value = sideBarLocal === _data ? 'min' : 'max';    
    setSideBar(value);
  
    localStorage.setItem('sideBar', value);
  };
  
  return (
    <div
      className={sideBar === 'min' ? 'l-navbar show' : 'l-navbar'}
      id="nav-bar"
    >
      <nav className="nav">
        <div>
          <Link
            to={DashboardRoutes.routes.home.path}
            className="nav_logo d-md-block d-none"
          >
            <img
              className="logo-1"
              src={productDetails.gearURL}
              alt={productDetails.name}
              title={productDetails.name}
              style={{
                //TODO:css
                width: '35px',
                height: '35px',
              }}
            />
            <img
              className="logo-2"
              src={productDetails.logoURL}
              alt={productDetails.name}
              title={productDetails.name}
            />
          </Link>
          <div className="nav_list sidebar sidebar-ht" id="sidebarnav">
            <ul className="nav flex-column" id="nav_accordion">
              <li title={DashboardRoutes.routes.home.name}>
              {isMobile ? (
                <Link
                to={DashboardRoutes.routes.home.path}
                className={`nav_link ${isActiveClass(
                  sideBarId,
                  DashboardRoutes.routes.home.sideBarId
                )}`}
                onClick={toggleSideBar}
              >
                <DashboardIcon />
                <span className="nav_name">{DashboardRoutes.name}</span>{' '}
              </Link>
              ):(
                <Link
                  to={DashboardRoutes.routes.home.path}
                  className={`nav_link ${isActiveClass(
                    sideBarId,
                    DashboardRoutes.routes.home.sideBarId
                  )}`}
                >
                  <DashboardIcon />
                  <span className="nav_name">{DashboardRoutes.name}</span>{' '}
                </Link>
              )}
              </li>

              {UserRoutes.routes.list.access && (
                <li title={UserRoutes.name}>
                   {isMobile ? (
                    <Link
                    to={UserRoutes.routes.list.path}
                    className={`nav_link ${isActiveClass(
                      sideBarId,
                      UserRoutes.routes.list.sideBarId
                    )}`}
                    onClick={toggleSideBar}
                  >
                    <UserIcon />
                    <span className="nav_name">{UserRoutes.name}</span>
                  </Link>
                   ):(
                    <Link
                    to={UserRoutes.routes.list.path}
                    className={`nav_link ${isActiveClass(
                      sideBarId,
                      UserRoutes.routes.list.sideBarId
                    )}`}
                  >
                    <UserIcon />
                    <span className="nav_name">{UserRoutes.name}</span>
                  </Link>
                   )}
                  
                </li>
              )}

              {UserOwnerRoutes.routes.list.access && (
                <li title={UserOwnerRoutes.name}>
                  {isMobile ? (
                     <Link
                     to={UserOwnerRoutes.routes.list.path}
                     className={`nav_link ${isActiveClass(
                       sideBarId,
                       UserOwnerRoutes.routes.list.sideBarId
                     )}`}
                     onClick={toggleSideBar}
                   >
                     <OwnerIcon />
                     <span className="nav_name">{UserOwnerRoutes.name}</span>
                   </Link>
                  ):(
                    <Link
                    to={UserOwnerRoutes.routes.list.path}
                    className={`nav_link ${isActiveClass(
                      sideBarId,
                      UserOwnerRoutes.routes.list.sideBarId
                    )}`}
                  >
                    <OwnerIcon />
                    <span className="nav_name">{UserOwnerRoutes.name}</span>
                  </Link>
                  )}
                 
                </li>
              )}

              {JobRoutes.routes.list.access && (
                <li title={JobRoutes.name}>
                  {isMobile ? (
                    <Link
                      to={JobRoutes.routes.list.path}
                      className={`nav_link ${isActiveClass(
                        sideBarId,
                        JobRoutes.routes.list.sideBarId
                      )}`}
                      onClick={toggleSideBar}
                    >
                      <JobIcon />
                      <span className="nav_name">{JobRoutes.name}</span>
                    </Link>
                  ) : (
                    <Link
                      to={JobRoutes.routes.list.path}
                      className={`nav_link ${isActiveClass(
                        sideBarId,
                        JobRoutes.routes.list.sideBarId
                      )}`}
                    >
                      <JobIcon />
                      <span className="nav_name">{JobRoutes.name}</span>
                    </Link>
                  )}
                </li>
              )}

              {PropertiesRoutes.routes.add.access && (
                <li title={PropertiesRoutes.name}>
                  {isMobile ? (
                    <Link
                    to={PropertiesRoutes.routes.list.path}
                    className={`nav_link ${isActiveClass(
                      sideBarId,
                      PropertiesRoutes.routes.list.sideBarId
                    )}`}
                    onClick={toggleSideBar}
                  >
                    <PropertiesIcon />
                    <span className="nav_name">{PropertiesRoutes.name}</span>
                  </Link>
                  ):(
                    <Link
                    to={PropertiesRoutes.routes.list.path}
                    className={`nav_link ${isActiveClass(
                      sideBarId,
                      PropertiesRoutes.routes.list.sideBarId
                    )}`}
                  >
                    <PropertiesIcon />
                    <span className="nav_name">{PropertiesRoutes.name}</span>
                  </Link>
                  )}
                  
                </li>
              )}

              {/* <li title={IntegrationCommonsRoutes.name}>
                <Link
                  to={
                    IntegrationCommonsRoutes.routes.integrationCommonList.path
                  }
                  className={`nav_link ${isActiveClass(
                    sideBarId,
                    IntegrationCommonsRoutes.routes.integrationCommonList
                      .sideBarId
                  )}`}
                >
                  <PropertyIcon />
                  <span className="nav_name">
                    {IntegrationCommonsRoutes.name}
                  </span>
                </Link>
              </li> */}

              <li title={AccountsRoutes.routes.settings.name}>
                {isMobile ? (
                  <Link
                  to={generateDynamicPath(AccountsRoutes.routes.settings.path, {
                    accountIndex: `${activeAccountIndex}`,
                  })}
                  className={`nav_link ${isActiveClass(
                    sideBarId,
                    AccountsRoutes.routes.settings.sideBarId
                  )}`}
                  onClick={toggleSideBar}
                >
                  <SettingIcon />
                  <span className="nav_name">
                    {AccountsRoutes.routes.settings.name}
                  </span>
                </Link>
                ):(
                  <Link
                  to={generateDynamicPath(AccountsRoutes.routes.settings.path, {
                    accountIndex: `${activeAccountIndex}`,
                  })}
                  className={`nav_link ${isActiveClass(
                    sideBarId,
                    AccountsRoutes.routes.settings.sideBarId
                  )}`}
                >
                  <SettingIcon />
                  <span className="nav_name">
                    {AccountsRoutes.routes.settings.name}
                  </span>
                </Link>
                )}
                
              </li>
            </ul>
          </div>
        </div>
        {/* <Link
          to={AuthRoutes.logout.path}
          className="nav_link"
          title={AuthRoutes.logout.name}
        >
          <LogOutIcon/>
          <img
            src={require('../../assets/images/logout.png').default}
            alt={AuthRoutes.logout.name}
          />
          <span className="nav_name">{AuthRoutes.logout.name}</span>
        </Link> */}
        <div className="mobile-logo d-sm-none">
          <a href="!#" className="nav_logo pl-0 justify-content-center">
            <img
              className="logo-2"
              src={productDetails.logoURL}
              alt={productDetails.name}
              title={productDetails.name}
            />
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
