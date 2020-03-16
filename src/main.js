import stringToUuid from 'uuid-by-string';
import { URLSearchParams } from 'url';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';

const { name: parentPackageName, version: parentPackageVersion } = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json')),
);

const categoryMapping = { 1: 'Primary KPI', 2: 'Secondary KPI', 3: 'Tertiary KPI' };
const isDev = hostname => /^localhost$|^127\.0\.0\.1$|-test\./i.test(hostname);

const getDefaultProperties = req => ({
  v: 1,
  tid: process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID || 'UA-26548270-15',
  cid: stringToUuid(req.ip),
  uip: req.ip,
  ua: req.get('User-Agent'),
  dr: req.get('Referer'),
  dh: req.hostname,
  dp: req.originalUrl,
  an: parentPackageName,
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
  if (isDev(properties.dh)) return Promise.resolve();
  const params = new URLSearchParams();

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

  return (req, res, next) => {
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

    next();
  };
};
