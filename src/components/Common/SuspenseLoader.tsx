import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NProgress from 'nprogress';

import { IAppReduxState } from '../../redux/reducer';

function SuspenseLoader() {
  const {
    auth: { product },
  } = useSelector((state: IAppReduxState) => state);

  useEffect(() => {
    NProgress.configure({ showSpinner: true });
    NProgress.start();

    return () => {
      NProgress.done();
    };
  });

  return (
    <div className="logo-wrap text-center">
      <img
        className="d-inline-block animated bounce infinite"
        src={product.logoURL}
        title={product.name}
        width="260"
        height="53"
        alt={product.name}
      />
    </div>
  );
}

export default SuspenseLoader;
