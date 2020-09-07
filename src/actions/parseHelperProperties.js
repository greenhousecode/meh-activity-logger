import { EVENT_CATEGORY_MAPPING } from '../config.json';
import generateHash from '../utils/generateHash';

export default (properties) => {
  const parsedProperties = { ...properties };

  if (properties.clientId) {
    parsedProperties.cid = generateHash(properties.clientId);
    delete parsedProperties.clientId;
  }

  if (properties.priority) {
    parsedProperties.ec = EVENT_CATEGORY_MAPPING[properties.priority];
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
    parsedProperties.av = properties.appVersion;
    parsedProperties.cd2 = properties.appVersion;
    delete parsedProperties.appVersion;
  }

  if (!properties.ua)
    parsedProperties.ua =
      'Mozilla/4.0 (compatible; MSIE 6.1; Windows XP; .NET CLR 1.1.4322; .NET CLR 2.0.50727)';

  return parsedProperties;
};
