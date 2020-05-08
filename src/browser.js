// import stringToUuid from 'uuid-by-string';
// import { URLSearchParams } from 'url';
import fetch from 'isomorphic-fetch';
// import { readFileSync } from 'fs';
// import { join } from 'path';

// const { name: parentPackageName, version: parentPackageVersion } = JSON.parse(
//   readFileSync(join(process.cwd(), 'package.json')),
// );

const categoryMapping = { 1: 'Primary KPI', 2: 'Secondary KPI', 3: 'Tertiary KPI' };

const isDev = hostname =>
  typeof hostname === 'string' && /^localhost$|^127\.0\.0\.1$|-(test|acc)\./i.test(hostname);

const getUserAgent = req => {
  if (req.get) return req.get('User-Agent');
  if (global.navigator && global.navigator.userAgent) return global.navigator.userAgent;
  return null;
};

const getReferer = req => {
  if (req.get) return req.get('Referer');
  if (global.document && global.document.referrer) return global.document.referrer;
  return null;
};

const getDefaultProperties = req => ({
  v: 1,
  tid: process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID || 'UA-26548270-15',
  // cid: req.ip ? stringToUuid(req.ip) : null,
  uip: req.ip,
  ua: getUserAgent(req),
  dr: getReferer(req),
  dh: global.location && global.location.hostname ? global.location.hostname : req.hostname,
  dp: global.location && global.location.pathname ? global.location.pathname : req.originalUrl,
  // an: parentPackageName,
  // aid: parentPackageName,
  // av: parentPackageVersion,
  // cd1: parentPackageName,
  // cd2: parentPackageVersion,
});

const parseCustomProperties = properties => {
  const parsedProperties = { ...properties };

  // if (properties.clientId) {
  //   parsedProperties.cid = stringToUuid(properties.clientId);
  //   delete parsedProperties.clientId;
  // }

  if (properties.userId) {
    parsedProperties.uid = properties.userId;
    delete parsedProperties.userId;
  }

  if (properties.priority) {
    parsedProperties.ec = categoryMapping[properties.priority];
    delete parsedProperties.priority;
  }

  if (properties.action) {
    parsedProperties.ea = properties.action;
    delete parsedProperties.action;
  }

  if (properties.label) {
    parsedProperties.el = properties.label;
    delete parsedProperties.label;
  }

  if (properties.value) {
    parsedProperties.ev = properties.value;
    delete parsedProperties.value;
  }

  if (properties.appName) {
    parsedProperties.an = properties.appName;
    parsedProperties.aid = properties.appName;
    parsedProperties.cd1 = properties.appName;
    delete parsedProperties.appName;
  }

  if (properties.appVersion) {
    parsedProperties.av = properties.appName;
    parsedProperties.cd2 = properties.appName;
    delete parsedProperties.appVersion;
  }

  return parsedProperties;
};

const sendData = properties => {
  if (isDev(properties.dh)) return Promise.resolve();
  const params = new global.URLSearchParams();

  Object.keys(properties).forEach(
    key => properties[key] != null && params.append(key, properties[key]),
  );

  return fetch('https://www.google-analytics.com/collect', { method: 'POST', body: params });
};

export default (trackingIdOrProperties = {}) => {
  const globalProperties =
    typeof trackingIdOrProperties === 'string'
      ? { tid: trackingIdOrProperties }
      : parseCustomProperties(trackingIdOrProperties);

  return (req = {}, res, next) => {
    const defaultProperties = { ...getDefaultProperties(req), ...globalProperties };

    req.event = actionOrProperties => {
      const properties =
        typeof actionOrProperties === 'string'
          ? { ea: actionOrProperties }
          : parseCustomProperties(actionOrProperties);

      return sendData({
        ...defaultProperties,
        ...{ t: 'event', ec: categoryMapping[1] },
        ...properties,
      });
    };

    req.pageview = (properties = {}) =>
      sendData({
        ...defaultProperties,
        ...{ t: 'pageview' },
        ...parseCustomProperties(properties),
      });

    return next ? next() : req;
  };
};
