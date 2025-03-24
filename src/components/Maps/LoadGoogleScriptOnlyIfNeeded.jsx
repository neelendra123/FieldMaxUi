import { LoadScript } from '@react-google-maps/api';

export default class LoadGoogleScriptOnlyIfNeeded extends LoadScript {
  constructor(props) {
    super(props);

    this._isMounted = false;
    // rest of your code
  }

  componentDidMount() {
    this._isMounted = true;

    const cleaningUp = true;
    const isBrowser = typeof document !== 'undefined'; // require('@react-google-maps/api/src/utils/isbrowser')
    const isAlreadyLoaded =
      window.google &&
      window.google.maps &&
      document.querySelector('body.first-hit-completed'); // AJAX page loading system is adding this class the first time the app is loaded
    if (!isAlreadyLoaded && isBrowser) {
      // @ts-ignore
      if (window.google && !cleaningUp) {
        console.error('google api is already presented');
        return;
      }

      if (this._isMounted) {
        this.isCleaningUp().then(this.injectScript);
      }
    }

    // if (isAlreadyLoaded) {
    //   // this.setState({ loaded: true });
    // }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}
