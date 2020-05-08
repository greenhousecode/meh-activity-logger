import 'isomorphic-fetch';

import getCwdPackageJson from './utils/getCwdPackageJson';
import createLogger from './actions/createLogger';
import generateHash from './utils/generateHash';

const { name: parentPackageName, version: parentPackageVersion } = getCwdPackageJson();

const getDefaultProperties = (req) => ({
  v: 1,
  tid: process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID || 'UA-26548270-15',
  uid: req.ip ? generateHash(req.ip) : null,
  uip: req.ip,
  ua: req.get ? req.get('User-Agent') : null,
  dr: req.get ? req.get('Referer') : null,
  dh: req.hostname,
  dp: req.originalUrl,
  an: parentPackageName,
  aid: parentPackageName,
  av: parentPackageVersion,
  cd1: parentPackageName,
  cd2: parentPackageVersion,
});

export default createLogger(getDefaultProperties);
