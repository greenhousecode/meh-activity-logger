import stringToUuid from 'uuid-by-string';
import parent from 'parent-package-json';
import { URLSearchParams } from 'url';
import fetch from 'node-fetch';

const { name: parentPackageName, version: parentPackageVersion } = parent().parse();
const categoryMapping = { 1: 'Primary KPI', 2: 'Secondary KPI', 3: 'Tertiary KPI' };

const getDefaultProperties = req => ({
  v: 1,
  tid: process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID,
  cid: stringToUuid(req.ip),
  uip: req.ip,
  ua: req.get('User-Agent'),
  dr: req.get('Referer'),
  dh: req.hostname,
  dp: req.originalUrl,
  aid: parentPackageName,
  av: parentPackageVersion,
  cd1: parentPackageName,
  cd2: parentPackageVersion,
});

const parseCustomProperties = properties => {
  const parsedProperties = { ...properties };

  if (properties.clientId) {
    parsedProperties.cid = stringToUuid(properties.clientId);
    delete parsedProperties.clientId;
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

  return parsedProperties;
};

const sendData = properties => {
  const params = new URLSearchParams();
  Object.keys(properties).forEach(key => params.append(key, properties[key]));
  return fetch('https://www.google-analytics.com/collect', { method: 'POST', body: params });
};

export default trackingIdOrProperties => {
  const globalProperties =
    typeof trackingIdOrProperties === 'string'
      ? { tid: trackingIdOrProperties }
      : trackingIdOrProperties;

  return (req, res, next) => {
    req.event = actionOrProperties => {
      const properties =
        typeof actionOrProperties === 'string' ? { ea: actionOrProperties } : actionOrProperties;

      return sendData({
        ...getDefaultProperties(req),
        ...globalProperties,
        ...{ t: 'event', ec: categoryMapping[1] },
        ...parseCustomProperties(properties),
      });
    };

    req.pageview = properties =>
      sendData({
        ...getDefaultProperties(req),
        ...globalProperties,
        ...{ t: 'pageview' },
        ...parseCustomProperties(properties),
      });

    next();
  };
};
