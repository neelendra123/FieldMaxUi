import { FunctionComponent, Fragment } from 'react';
import { FaSpinner } from 'react-icons/fa';

type FetchingCompProps = {
  isFetching?: boolean;
};

const FetchingComp: FunctionComponent<FetchingCompProps> = ({
  isFetching = false,
}) => {
  return (
    <Fragment>
      {isFetching && (
        <div className="overlay">
          <FaSpinner className="spinner" />
        </div>
      )}
    </Fragment>
  );
};

export default FetchingComp;
