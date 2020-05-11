# MEH Activity Logger

> Log custom events and pageviews with opinionated defaults to Google Analytics through Express middleware, Node or the browser.

## Install

```shell
yarn add meh-activity-logger
```

## Usage

Event logging example in all three environments with the same outcome:

```js
// 1. Node with Express
import expressMiddleware as mehActivityLogger from 'meh-activity-logger';
import express from 'express';

express()
  .use(mehActivityLogger('UA-XXXXXX-X')) // Shorthand for: mehActivityLogger({ tid: 'UA-XXXXXX-X' })
  .get('/example', (req, res) => {
    req.event('Example event').catch(console.error); // Shorthand for: event({ action: 'Example event' })
    res.sendStatus(200);
  })
  .listen(3000);
```

```js
// 2. Node without Express
import mehActivityLogger from 'meh-activity-logger';

const { event } = mehActivityLogger('UA-XXXXXX-X');

event({
  action: 'Example event',
  userId: '0.0.0.0',
  uip: '0.0.0.0',
  ua:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  dr: 'https://www.example.com/',
  dh: 'example.com',
  dp: '/example',
}).catch(console.error);
```

```html
<!-- 3. Browser with JavaScript -->
<script src="https://unpkg.com/meh-activity-logger"></script>
<script>
  var logger = window.mehActivityLogger.default({
    tid: 'UA-XXXXXX-X',
    appName: 'example-app',
    appVersion: '1.0.0',
  });

  logger
    .event({
      action: 'Example event',
      userId: '0.0.0.0',
      uip: '0.0.0.0',
    })
    .catch(console.error);
</script>
```

Will all result in:

```
// POST https://www.google-analytics.com/collect (form data)

v=1
&tid=UA-XXXXXX-X
&ua=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_4%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F81.0.4044.138+Safari%2F537.36
&dr=https%3A%2F%2Fwww.example.com%2F
&dh=example.com
&dp=%2Fexample
&uip=0.0.0.0
&t=event
&uid=2065339419
&ec=Primary+KPI
&ea=Example+event
&an=example-app
&aid=example-app
&cd1=example-app
&av=1.0.0
&cd2=1.0.0
```

## API

### `activityLogger([measurementId|properties])`

- Returns: `Function` ([`event`](#eventactionproperties))

Sets global properties for all GA events.

#### `measurementId`

- Type: `String`

[Measurement ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid) (format: `"UA-XXXXXX-X"`). Equivalent to `{ tid: 'UA-XXXXXX-X' }`.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                                  | Default value                                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `v` ([Protocol Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v))      | `1`                                                                                               |
| `tid` ([Measurement ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#td))     | `process.env.MEH_ACTIVITY_LOGGER_MEASUREMENT_ID` or `'UA-26548270-15'` (defaults to MEH property) |
| `uip` ([IP Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip))       | `req.ip` (anonymized in GA)                                                                       |
| `ua` ([User Agent Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua)) | `req.get('User-Agent')` or `navigator.userAgent`                                                  |
| `dr` ([Document Referrer](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr))   | `req.get('Referer')` or `document.referrer`                                                       |
| `dh` ([Document Host Name](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh))  | `req.hostname` or `location.hostname`                                                             |
| `dp` ([Document Path](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp))       | `req.originalUrl` or `location.pathname`                                                          |
| `an` ([Application Name](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an))    | `name` value from your project's `package.json`                                                   |
| `aid` ([Application ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid))    | `name` value from your project's `package.json`                                                   |
| `av` ([Application Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av)) | `version` value from your project's `package.json`                                                |
| `cd1` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | `name` value from your project's `package.json`                                                   |
| `cd2` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | `version` value from your project's `package.json`                                                |

> For all other GA properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

### `event(eventAction|properties)`

- Returns: `Promise`<[Response](https://www.npmjs.com/package/isomorphic-fetch)>

Overrides global properties, and fires a custom event to Google Analytics.

#### `eventAction`

- Type: `String`

[Event Action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea). Equivalent to `{ action: 'Example' }` or `{ ea: 'Example' }`.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                             | Default value   |
| --------------------------------------------------------------------------------------------------------------- | --------------- |
| `t` ([Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t))         | `"event"`       |
| `ec` ([Event Category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec)) | `"Primary KPI"` |

> For all other GA properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

Custom properties:

| Key          | Type                    | Description                                                                       | Maps to                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `userId`     | String                  | A unique representation of the user/session. Its value will be hashed/anonymized. | `uid` ([User ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uid))                                                                                                                                                                                                                                                |
| `priority`   | Integer (`1`\|`2`\|`3`) | Resolves to `"Primary KPI"`, `"Secondary KPI"` or `"Tertiary KPI"` respectively.  | `ec` ([Event Category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec))                                                                                                                                                                                                                                           |
| `action`     | String                  | Describes the event taking place.                                                 | `ea` ([Event Action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea))                                                                                                                                                                                                                                             |
| `label`      | String                  | Labels the event.                                                                 | `el` ([Event Label](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el))                                                                                                                                                                                                                                              |
| `value`      | Integer                 | Adds a metric to the label.                                                       | `ev` ([Event Value](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ev))                                                                                                                                                                                                                                              |
| `appName`    | String                  | Identifies the app name.                                                          | `an` ([Application Name](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an)), `aid` ([Application ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid)), `cd1` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_)) |
| `appVersion` | String                  | Identifies the app version.                                                       | `av` ([Application Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av)), `cd2` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))                                                                                                                 |

### `pageview([properties])`

- Returns: `Promise`<[Response](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Response_objects)>

Optionally overrides global properties, and fires a pageview event to Google Analytics.

#### `properties` <small>([GA Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference))</small>

- Type: `Object`

Defaults:

| Key                                                                                                     | Default value |
| ------------------------------------------------------------------------------------------------------- | ------------- |
| `t` ([Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t)) | `"pageview"`  |
