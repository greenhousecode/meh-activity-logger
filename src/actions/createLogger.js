import parseHelperProperties from './parseHelperProperties';
import sendGaMeasurement from './sendGaMeasurement';
import { CATEGORY_MAPPING } from '../config.json';

export default (getDefaultProperties) => (trackingIdOrProperties = {}) => {
  const globalProperties =
    typeof trackingIdOrProperties === 'string'
      ? { tid: trackingIdOrProperties }
      : parseHelperProperties(trackingIdOrProperties);

  return (req = {}, res, next) => {
    const defaultProperties = { ...getDefaultProperties(req), ...globalProperties };

    req.event = (actionOrProperties) => {
      const properties =
        typeof actionOrProperties === 'string'
          ? { ea: actionOrProperties }
          : parseHelperProperties(actionOrProperties);

      return sendGaMeasurement({
        ...defaultProperties,
        ...{ t: 'event', ec: CATEGORY_MAPPING[1] },
        ...properties,
      });
    };

    req.pageview = (properties = {}) =>
      sendGaMeasurement({
        ...defaultProperties,
        ...{ t: 'pageview' },
        ...parseHelperProperties(properties),
      });

    return next ? next() : req;
  };
};
