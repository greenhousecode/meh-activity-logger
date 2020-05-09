import parseHelperProperties from './actions/parseHelperProperties';
import getDefaultProperties from './actions/getDefaultProperties';
import sendGaMeasurement from './actions/sendGaMeasurement';
import { EVENT_CATEGORY_MAPPING } from './config.json';

const getEvent = (globalProperties, req) => (properties = {}) =>
  sendGaMeasurement(
    parseHelperProperties({
      ...getDefaultProperties(req),
      ec: EVENT_CATEGORY_MAPPING[1],
      ...globalProperties,
      ...properties,
      t: 'event',
    }),
  );

const getPageView = (globalProperties, req) => (properties = {}) =>
  sendGaMeasurement(
    parseHelperProperties({
      ...getDefaultProperties(req),
      ...globalProperties,
      ...properties,
      t: 'pageView',
    }),
  );

export default (globalProperties = {}) => ({
  event: getEvent(globalProperties),
  pageView: getPageView(globalProperties),
});

// TODO:
export const expressMiddleware = (globalProperties = {}) => {
  return (req, res, next) => {
    req.event = getEvent(globalProperties, req);
    req.pageView = getPageView(globalProperties, req);
    next();
  };
};
