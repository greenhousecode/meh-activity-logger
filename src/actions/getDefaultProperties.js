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
    ua: req.get
      ? req.get('User-Agent')
      : 'Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
    dr: req.get ? req.get('Referer') : null,
    dh: req.hostname,
    dp: req.originalUrl,
    appName,
    appVersion,
  };
};
