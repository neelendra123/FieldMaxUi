import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { IAppReduxState } from '../../../redux/reducer';

import { formatPrice } from '../../../utils/common';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';

import SubscriptionRoutes from '../routes';

import TickIcon from '../Icons/TickIcon';

import * as interfaces from '../interfaces';
import * as services from '../services';

const subsItems = [
  'users',
  'Jobs',
  'Photo Storage',
  'Web Android & Ios',
  'Company logo',
  'Photo Markup',
  'Photo Tags',
  'Photo Comments',
  'Photo Galleries',
  'Document Uploads',
  'Document Scanning',
  'Job labels',
  'Permission and Roles',
  'Advanced Filtering',
  'Notifications',
  'Geo Tagging',
  'Date / Time / User Tagging',
  'Auto Photo Labelling',
];

export default function ViewProfile() {
  const isMounted = useMountedState();

  const {
    auth: { product },
  } = useSelector((state: IAppReduxState) => state);

  const [isFetching, setIsFetching] = useState(false);

  const [paymentInterval, setPaymentInterval] =
    useState<interfaces.IPlanPaymentInterval>(
      interfaces.IPlanPaymentInterval.Month
    );

  const [plans, setPlans] = useState<{
    monthly: interfaces.IPlanTypes[];
    yearly: interfaces.IPlanTypes[];
  }>({
    monthly: [],
    yearly: [],
  });

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const plans = await services.plansListService(product.productKind);
      if (!isMounted()) {
        return;
      }

      setPlans(plans);
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
  }, []);

  return (
    <Main sideBarId={SubscriptionRoutes.routes.listPlans.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="upgrade-container">
        <div className="d-flex justify-content-center">
          <div className="fz-20 d-flex ">
            Monthly
            <div>
              <label className="switch1 mx-2">
                <input
                  type="checkbox"
                  checked={
                    paymentInterval === interfaces.IPlanPaymentInterval.Year
                  }
                  onChange={(event) => {
                    setPaymentInterval(
                      event.target.checked
                        ? interfaces.IPlanPaymentInterval.Year
                        : interfaces.IPlanPaymentInterval.Month
                    );
                  }}
                />
                <span className="slider1 round" />
              </label>
            </div>
            Yearly
          </div>
        </div>

        <div className="container">
          <div className="row">
            {plans[
              paymentInterval === interfaces.IPlanPaymentInterval.Month
                ? 'monthly'
                : 'yearly'
            ].map((plan) => (
              <div className="col-md-4 mt-3" key={plan.id}>
                <div className="package-cont">
                  <h6>{plan.name}</h6>
                  <h5>
                    ${formatPrice(plan.price)} <span>/{plan.description}</span>
                  </h5>
                  <div>
                    <ul>
                      {subsItems.map((sub) => (
                        <li key={sub}>
                          <div className="d-flex">
                            <TickIcon className="mr-3" />
                            {sub}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {plan.isComingSoon && (
                      <button disabled={true} className="btn btn-primary w-100">
                        Coming Soon
                      </button>
                    )}

                    {!plan.isComingSoon && (
                      <button
                        disabled={plan.isComingSoon}
                        className="btn btn-primary w-100"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Main>
  );
}
