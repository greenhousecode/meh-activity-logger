import getCwdPackageJson from '../utils/getCwdPackageJson';
import { DEFAULT_PROPERTIES } from '../config.json';

export default (req = {}) => {
  // Browser
  if (typeof window !== 'undefined') {
    return {
      ...DEFAULT_PROPERTIES,
      ua: window.navigator.userAgent,
      dr: window.document.referrer,
      dh: window.location.hostname,
      dp: window.location.pathname,
    };
  }

  // Node
  const { name: appName, version: appVersion } = getCwdPackageJson();

  return {
    ...DEFAULT_PROPERTIES,
    tid: process.env.MEH_ACTIVITY_LOGGER_MEASUREMENT_ID || DEFAULT_PROPERTIES.tid,
    userId: req.ip,
    uip: req.ip,
    ua: req.get ? req.get('User-Agent') : null,
    dr: req.get ? req.get('Referer') : null,
    dh: req.hostname,
    dp: req.originalUrl,
    appName,
    appVersion,
  };
};
