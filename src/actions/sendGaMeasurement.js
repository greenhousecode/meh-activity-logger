import { IS_DEV_REGEXP, GOOGLE_ANALYTICS_ENDPOINT } from '../config.json';

const isDev = (hostname) =>
  typeof hostname === 'string' && new RegExp(...IS_DEV_REGEXP).test(hostname);

export default async (properties) => {
  if (isDev(properties.dh)) return { status: 204, statusText: 'No Content' };
  const params = new global.URLSearchParams();

  Object.keys(properties).forEach(
    (key) => properties[key] != null && params.append(key, properties[key]),
  );

  const response = await global.fetch(GOOGLE_ANALYTICS_ENDPOINT, { method: 'POST', body: params });
  return response;
};
