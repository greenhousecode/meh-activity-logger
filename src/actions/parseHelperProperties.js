import { EVENT_CATEGORY_MAPPING } from '../config.json';
import generateHash from '../utils/generateHash';

export default (properties) => {
  const parsedProperties = { ...properties };

  if (properties.userId) {
    parsedProperties.uid = generateHash(properties.userId);
    delete parsedProperties.userId;
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

  return parsedProperties;
};
