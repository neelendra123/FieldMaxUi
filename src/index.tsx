import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

import { isProduction } from './config';
import reportWebVitals from './reportWebVitals';

import store from './redux/store';

import ErrorBoundary from './pages/Errors/ErrorBoundary';

import SuspenseLoader from './components/Common/SuspenseLoader';

import './App.scss';

import 'nprogress/nprogress.css';


const history = createBrowserHistory();

const renderLoader = () => <SuspenseLoader />;

const RoutesComponent = lazy(() => import('./Routes'));

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <React.StrictMode>
          {isProduction ? (
            <ErrorBoundary>
              <Suspense fallback={renderLoader()}>
                <RoutesComponent />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <Suspense fallback={renderLoader()}>
              <RoutesComponent />
            </Suspense>
          )}
      </React.StrictMode>
    </Provider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
