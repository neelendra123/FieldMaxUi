import { useSelector } from 'react-redux';

import { IAppReduxState } from '../../redux/reducer';

function ProductLogo() {
  const {
    auth: { product },
  } = useSelector((state: IAppReduxState) => state);

  return (
    <div className="logo-wrap text-center">
      <img
        className="d-inline-block"
        src={product.logoURL}
        title={product.name}
        width="260"
        height="53"
        alt={product.name}
      />
    </div>
  );
}

export default ProductLogo;
