import { useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import DashboardRoutes from '../../Dashboard/routes';

import './style.css';

type MyProps = RouteComponentProps<{}>;

const NotFound: React.FC<MyProps> = () => {
  useEffect(() => {
    document.body.className = 'p-0 m-0';
    return () => {
      document.body.className = '';
    };
  });

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>
            4<span>0</span>4
          </h1>
        </div>
        <br />
        <br />
        <br />
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <Link to={DashboardRoutes.routes.home.path}>Home Page</Link>
      </div>
    </div>
  );
};

export default NotFound;
