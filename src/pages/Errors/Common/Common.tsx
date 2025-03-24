import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import AuthRoutes from '../../Auth/routes';

const CommonError: React.FC<any> = () => {
  useEffect(() => {
    document.body.className = 'p-0 m-0';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="errorContent">
      <div className="row">
        <div className="col-md-12">
          <div className="browser">
            <div className="controls">
              <i />
              <i />
              <i />
            </div>

            <div className="eye"></div>
            <div className="eye"></div>
            <div className="mouth">
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
              <div className="lips"></div>
            </div>
          </div>

          <div className="errorHeader">
            Unfortunately, something has gone wrong.
          </div>
          <div className="errorBody">
            We're unable to fulfill your request. Please
            <b
              style={{
                color: '#FFA500',
                cursor: 'pointer',
              }}
              onClick={() => {
                window.location.reload();
              }}
            >
              {' '}
              refresh your browser
            </b>{' '}
            or{' '}
            <Link
              style={{
                color: '#ff5e5b',
              }}
              to={AuthRoutes.logout.path}
            >
              {' '}
              clear your site data
            </Link>
            . If the error continues please contact our{' '}
            <b>
              <a
                style={{
                  color: '#4fd44c',
                }}
                href="mailto:rohit@dev-story.com?subject=Error&body=Message"
              >
                Support Team
              </a>
            </b>
            .
          </div>
        </div>
      </div>

      <div className="errorFooter">
        <Link to={AuthRoutes.logout.path}>{AuthRoutes.logout.name}</Link>
      </div>
    </div>
  );
};

export default CommonError;
