import getMeasurement from './actions/getMeasurement';
import getProperties from './utils/getProperties';

export default (measurementIdOrProperties = {}) => {
  const properties = getProperties('tid', measurementIdOrProperties);

  return {
    event: getMeasurement('event', properties),
    pageView: getMeasurement('pageView', properties),
  };
};

export const expressMiddleware = (measurementIdOrProperties = {}) => {
  const properties = getProperties('tid', measurementIdOrProperties);

  return (req, res, next) => {
    req.event = getMeasurement('event', properties, req);
    req.pageView = getMeasurement('pageView', properties, req);
    next();
  };
};
