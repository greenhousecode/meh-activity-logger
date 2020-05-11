import fetch from 'cross-fetch';
import { REQUIRED_PROPERTIES, GOOGLE_ANALYTICS_ENDPOINTS } from '../config.json';

const isDev = (hostname) => /^localhost$|^127\.0\.0\.1$|-(test|acc)\./i.test(hostname);

export default async (properties = {}) => {
  // Remove empty properties
  const filteredProperties = { ...properties };
  Object.keys(filteredProperties).forEach(
    (key) => filteredProperties[key] == null && delete filteredProperties[key],
  );

  const missingProperties = REQUIRED_PROPERTIES[filteredProperties.t].filter(
    (requiredProperty) => !Object.keys(filteredProperties).includes(requiredProperty),
  );

  if (missingProperties.length)
    throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);

  const googleAnalyticsEndpoint = isDev(properties.dh)
    ? GOOGLE_ANALYTICS_ENDPOINTS.DEBUG
    : GOOGLE_ANALYTICS_ENDPOINTS.PRODUCTION;

  const body = new URLSearchParams();

  Object.keys(filteredProperties).forEach(
    (key) => filteredProperties[key] != null && body.append(key, filteredProperties[key]),
  );

  const response = await fetch(googleAnalyticsEndpoint, { method: 'POST', body });
  return response;
};
