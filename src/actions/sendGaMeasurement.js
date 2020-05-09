import { REQUIRED_PROPERTIES, GOOGLE_ANALYTICS_ENDPOINTS } from '../config.json';

// TODO: re-enable
// const isDev = (hostname) =>
//   typeof hostname === 'string' && /^localhost$|^127\.0\.0\.1$|-(test|acc)\./i.test(hostname);

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

  // TODO: remove debug
  const googleAnalyticsEndpoint = GOOGLE_ANALYTICS_ENDPOINTS.DEBUG;
  // const googleAnalyticsEndpoint = isDev(properties.dh)
  //   ? GOOGLE_ANALYTICS_ENDPOINTS.DEBUG
  //   : GOOGLE_ANALYTICS_ENDPOINTS.PRODUCTION;

  // Isomorphic hack
  const body = URLSearchParams ? new URLSearchParams() : new global.URLSearchParams();

  Object.keys(filteredProperties).forEach(
    (key) => filteredProperties[key] != null && body.append(key, filteredProperties[key]),
  );

  // FIXME: isomorphic fetch (only works in browser currently)
  const response = await fetch(googleAnalyticsEndpoint, { method: 'POST', body });
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return response;
};
