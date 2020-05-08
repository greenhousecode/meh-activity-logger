import 'regenerator-runtime/runtime';
import 'core-js';

import createLogger from './actions/createLogger';

const getDefaultProperties = () => ({
  v: 1,
  tid: 'UA-26548270-15',
  ua: window.navigator.userAgent,
  dr: window.document.referrer,
  dh: window.location.hostname,
  dp: window.location.pathname,
});

export default createLogger(getDefaultProperties);
