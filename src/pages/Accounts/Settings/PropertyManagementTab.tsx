import { useHistory } from 'react-router-dom';
import { FcNext } from 'react-icons/fc';

import IntegrationCommonRoutes from '../../IntegrationCommons/routes';

import { IIntegrationCommonSubModuleTypes } from '../../Orgs/interfaces';

interface PropertyManagementTabProps {}

export default function PropertyManagementTab({}: PropertyManagementTabProps) {
  const history = useHistory();

  return (
    <div>
      <div className="card mt-5 p-3 rounded equal-shadow">
        <div
          className="d-flex px-3 py-4  justify-content-between align-items-center border-bottom"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.serviceManagerCategories}`
            );
          }}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Categories</h6>
          <FcNext className="fz-20" />
        </div>
        <div
          className="d-flex px-3 py-4 justify-content-between align-items-center border-bottom"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.serviceManagerStatuses}`
            );
          }}
        >
          <p className="fz-18 mb-0 font-weight-bold">Statuses</p>
          <FcNext className="fz-20" />
        </div>

        <div
          className="d-flex px-3 py-4  justify-content-between align-items-center border-bottom"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.serviceManagerPriorities}`
            );
          }}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Priorities</h6>
          <FcNext className="fz-20" />
        </div>

        <div
          className="d-flex px-3 py-4  justify-content-between align-items-center border-bottom"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.chargeTypes}`
            );
          }}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Charge Types</h6>
          <FcNext className="fz-20" />
        </div>

        <div
          className="d-flex px-3 py-4  justify-content-between align-items-center border-bottom"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.propertyTypes}`
            );
          }}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Property Types</h6>
          <FcNext className="fz-20" />
        </div>

        <div
          className="d-flex px-3 py-4  justify-content-between align-items-center"
          onClick={() => {
            history.push(
              `${IntegrationCommonRoutes.routes.integrationCommonList.path}#${IIntegrationCommonSubModuleTypes.unitTypes}`
            );
          }}
        >
          <h6 className="fz-18 mb-0 font-weight-bold">Unit Types</h6>
          <FcNext className="fz-20" />
        </div>
      </div>
    </div>
  );
}
