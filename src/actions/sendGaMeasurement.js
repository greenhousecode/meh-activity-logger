import fetch from 'cross-fetch';
import { REQUIRED_PROPERTIES, GOOGLE_ANALYTICS_ENDPOINTS } from '../config.json';

const isDev = (hostname) => /^localhost$|^127\.0\.0\.1$|-(test|acc)\./i.test(hostname);
const urlTypeProperties = ['dr', 'dl', 'dp', 'st'];

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

  Object.keys(filteredProperties).forEach(
    (key) =>
      filteredProperties[key] != null &&
      body.append(
        key,
        // Prevent "&" characters from breaking the GA query string (UNKNOWN_PARAMETER)
        urlTypeProperties.includes(key)
          ? encodeURIComponent(filteredProperties[key])
          : filteredProperties[key].replace(/&/g, '%26'),
      ),
  );

  const response = await fetch(googleAnalyticsEndpoint, { method: 'POST', body });
  return response;
};
