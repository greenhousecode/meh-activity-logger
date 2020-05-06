# MEH Activity Logger

> Express middleware to log custom events to Google Analytics.

## Install

```shell
yarn add meh-activity-logger
```

## Usage

Logging an event:

```js
// With Express
import express from 'express';
import activityLogger from 'meh-activity-logger';

express()
  .use(activityLogger('UA-XXXXXX-X'))
  .get('/example', (req, res) => {
    req.event('Example event');
    res.sendStatus(200);
  })
  .listen(3000);
```

```js
// Without Express
import activityLogger from 'meh-activity-logger';

const logger = activityLogger('UA-XXXXXX-X');

logger.event({
  action: 'Example event',
  clientId: '0.0.0.0',
  uip: '0.0.0.0',
  ua:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  dr: 'https://www.example.com/',
  dh: 'example.com',
  dp: '/example',
});
```

Will both result in:

```json
// POST https://www.google-analytics.com/collect

{
  "v": 1,
  "tid": "UA-XXXXXX-X",
  "cid": "d3486ae9-136e-5856-bc42-212385ea7970",
  "uip": "0.0.0.0",
  "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
  "dr": "https://www.example.com/",
  "t": "event",
  "dh": "example.com",
  "dp": "/example",
  "an": "example-app",
  "aid": "example-app",
  "av": "1.0.0",
  "ec": "Primary KPI",
  "ea": "Example event",
  "cd1": "example-app",
  "cd2": "1.0.0"
}
```

## API

### `activityLogger([trackingId|properties])`

- Returns: `Function` ([`event`](#eventactionproperties))

Optionally sets global properties for all GA events.

#### `trackingId`

- Type: `String`

[Tracking ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid) (format: `"UA-XXXXXX-X"`). Equal to `{ tid: 'UA-XXXXXX-X' }`.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                                  | Default value                                                                                  |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `v` ([Protocol Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v))      | `1`                                                                                            |
| `tid` ([Tracking ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#td))        | _`process.env.MEH_ACTIVITY_LOGGER_TRACKING_ID || 'UA-26548270-15'` (defaults to MEH property)_ |
| `cid` ([Client ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid))         | _Generated UUID from `req.ip`_                                                                 |
| `uip` ([IP Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip))       | _`req.ip` (anonymized in GA)_                                                                  |
| `ua` ([User Agent Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua)) | _`req.get('User-Agent')`_                                                                      |
| `dr` ([Document Referrer](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr))   | _`req.get('Referer')`_                                                                         |
| `dh` ([Document Host Name](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh))  | _`req.hostname`_                                                                               |
| `dp` ([Document Path](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp))       | _`req.originalUrl`_                                                                            |
| `an` ([Application Name](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an))    | _`name` value from your project's `package.json`_                                              |
| `aid` ([Application ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid))    | _`name` value from your project's `package.json`_                                              |
| `av` ([Application Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av)) | _`version` value from your project's `package.json`_                                           |
| `cd1` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | _`name` value from your project's `package.json`_                                              |
| `cd2` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | _`version` value from your project's `package.json`_                                           |

> For all other GA properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

### `event(action|properties)`

- Returns: `Promise`<[Response](https://www.npmjs.com/package/node-fetch#class-response)>

Overrides global properties, and fires a custom event to Google Analytics.

#### `action`

- Type: `String`

[Event Action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea). Equal to `{ action: 'Example' }` or `{ ea: 'Example' }`.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                             | Default value   |
| --------------------------------------------------------------------------------------------------------------- | --------------- |
| `t` ([Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t))         | `"event"`       |
| `ec` ([Event Category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec)) | `"Primary KPI"` |

> For all other GA properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

Custom properties:

| Key        | Type          | Description                                                                  | Maps to                                                                                                         |
| ---------- | ------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `clientId` | String        | Generates a UUID from the input string.                                      | `cid` ([Client ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid))    |
| `priority` | `1`\|`2`\|`3` | Maps to `"Primary KPI"`, `"Secondary KPI"` or `"Tertiary KPI"` respectively. | `ec` ([Event Category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec)) |
| `action`   | String        | Describes the event taking place.                                            | `ea` ([Event Action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea))   |
| `label`    | String        | Labels the event.                                                            | `el` ([Event Label](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el))    |
| `value`    | Integer       | Adds a metric to the event.                                                  | `ev` ([Event Value](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ev))    |

### `pageview([properties])`

- Returns: `Promise`<[Response](https://www.npmjs.com/package/node-fetch#class-response)>

Optionally overrides global properties, and fires a pageview event to Google Analytics.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                     | Default value |
| ------------------------------------------------------------------------------------------------------- | ------------- |
| `t` ([Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t)) | `"pageview"`  |
