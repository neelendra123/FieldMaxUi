import { Component } from 'react';

import Common from './Common/Common';

class ErrorBoundary extends Component {
  state = { error: false, errorMessage: '' };

  static getDerivedStateFromError(error: any) {
    // Update state to render the fallback UI
    return { error: true, errorMessage: error.toString() };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error to an error reporting service like Sentry
    console.log({ error, errorInfo });
  }

  render() {
    const { error, errorMessage } = this.state;
    const { children } = this.props;

    return error ? <Common {...{ error, errorMessage }} /> : children;
    // return <Common {...{ error, errorMessage }} />;
  }
}

export default ErrorBoundary;
