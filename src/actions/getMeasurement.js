import parseHelperProperties from './parseHelperProperties';
import getDefaultProperties from './getDefaultProperties';
import sendGaMeasurement from './sendGaMeasurement';
import getProperties from '../utils/getProperties';

export default (hitType, globalProperties, req) => (eventActionOrProperties = {}) =>
  sendGaMeasurement(
    parseHelperProperties({
      ...getDefaultProperties(req),
      priority: hitType === 'event' ? 1 : null,
      ...globalProperties,
      ...getProperties('ea', eventActionOrProperties),
      t: hitType,
    }),
  );
