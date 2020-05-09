import { DEFAULT_PROPERTIES } from '../config.json';
import getCwdPackageJson from '../utils/getCwdPackageJson';

export default (req = {}) => {
  // Node
  if (typeof window === 'undefined') {
    const { name: appName, version: appVersion } = getCwdPackageJson();

    return {
      ...DEFAULT_PROPERTIES,
      tid: process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID || DEFAULT_PROPERTIES.tid,
      userId: req.ip,
      uip: req.ip,
      ua: req.get ? req.get('User-Agent') : null,
      dr: req.get ? req.get('Referer') : null,
      dh: req.hostname,
      dp: req.originalUrl,
      appName,
      appVersion,
    };
  }

  // Browser
  return {
    ...DEFAULT_PROPERTIES,
    ua: window.navigator.userAgent,
    dr: window.document.referrer,
    dh: window.location.hostname,
    dp: window.location.pathname,
  };
};
