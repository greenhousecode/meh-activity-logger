import fetch from 'cross-fetch';
import { REQUIRED_PROPERTIES, GOOGLE_ANALYTICS_ENDPOINTS } from '../config.json';

const isDev = (hostname) => /^localhost$|^127\.0\.0\.1$|-(test|acc)\./i.test(hostname);
const urlTypeProperties = ['dr', 'dl', 'dp', 'st'];

const escapeValues = (properties) =>
  Object.keys(properties).reduce((acc, key) => {
    if (properties[key] == null) return acc;

    // Prevent "&" characters from breaking the GA query string (UNKNOWN_PARAMETER)
    if (urlTypeProperties.includes(key)) {
      acc[key] = encodeURIComponent(properties[key]);
    } else if (typeof properties[key] === 'string') {
      acc[key] = properties[key].replace(/&/g, '%26');
    } else {
      acc[key] = properties[key];
    }

    return acc;
  }, {});

export default async (type, properties = {}) => {
  // Remove empty properties
  const filteredProperties = { ...properties };
  Object.keys(filteredProperties).forEach(
    (key) => filteredProperties[key] == null && delete filteredProperties[key],
  );

  const missingProperties = REQUIRED_PROPERTIES[type].filter(
    (requiredProperty) => !Object.keys(filteredProperties).includes(requiredProperty),
  );

  if (missingProperties.length)
    throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);

  const googleAnalyticsEndpoint = isDev(properties.dh)
    ? GOOGLE_ANALYTICS_ENDPOINTS.DEBUG
    : GOOGLE_ANALYTICS_ENDPOINTS.PRODUCTION;

  const body = new URLSearchParams();
  const escapedFilteredProperties = escapeValues(filteredProperties);

  Object.keys(escapedFilteredProperties).forEach((key) =>
    body.append(key, escapedFilteredProperties[key]),
  );

  const response = await fetch(googleAnalyticsEndpoint, { method: 'POST', body });
  return response;
};
