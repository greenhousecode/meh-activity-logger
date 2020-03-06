# MEH Activity Logger

> Express middleware to log custom events to Google Analytics.

## Install

```shell
yarn add meh-activity-logger
```

## Usage

Logging events through Express:

```js
import express from 'express';
import activityLogger from 'meh-activity-logger';

express()
  .use(activityLogger({ tid: 'UA-XXXXXX-X' }))
  .get('/', (req, res) => {
    req.event({ action: 'Some event', priority: 1 });
    res.sendStatus(200);
  })
  .listen(3000);
```

Or directly:

```js
import express from 'express';
import activityLogger from 'meh-activity-logger';

const event = activityLogger({ tid: 'UA-XXXXXX-X' });

express()
  .get('/', event({ action: 'Some event', priority: 1 }), (req, res) => res.sendStatus(200))
  .listen(3000);
```

## API

### `activityLogger(properties)`

- Returns: `Function` ([`event`](#eventproperties))

Sets global properties for all GA events.

#### `properties`

- Type: `Object`

Properties with default values:

| Key                                                                                                                  | Default value                                        |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `v` ([Protocol Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v))      | `"1"`                                                |
| `aid` ([Application ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid))    | _`name` value from your project's `package.json`_    |
| `av` ([Application Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av)) | _`version` value from your project's `package.json`_ |
| `cd1` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | _`name` value from your project's `package.json`_    |
| `cd2` ([Custom Dimension](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_))  | _`version` value from your project's `package.json`_ |

> For all other properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

### `event(properties)`

- Returns: `Promise<void>`

Overrides global properties, and fires a custom event to Google Analytics.

#### `properties`

- Type: `Object`

Properties with default values:

| Key                                                                                                                  | Default value                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `t` ([Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t))              | `"event"`                                                                                                       |
| `dp` ([Document Path](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp))       | _`req.originalUrl`_                                                                                             |
| `dr` ([Document Referrer](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr))   | _`req.get('referer')`_                                                                                          |
| `ua` ([User Agent Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua)) | _`req.get('user-agent')`_                                                                                       |
| `uip` ([IP Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip))       | _`req.connection.remoteAddress` or `req.socket.remoteAddress` or `req.get('x-forwarded-for').split(',').pop()`_ |

Helper/alias properties:

| Key        | Type    | Description                                                                                          | Mapped property                                                                                                 | Default value                                                                                                                       |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `user`     | String  | A unique representation of the visitor. Automatically transforms value to a UUID.                    | `cid` ([Client ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid))    | _Generated UUID from `req.connection.remoteAddress` or `req.socket.remoteAddress` or `req.get('x-forwarded-for').split(',').pop()`_ |
| `priority` | Integer | Either `1`, `2` or `3`. Maps to `"Primary KPI"`, `"Secondary KPI"` or `"Tertiary KPI"` respectively. | `ec` ([Event Category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec)) | `1`                                                                                                                                 |
| `action`   | String  | Alias for `ea`. Describes the event taking place.                                                    | `ea` ([Event Action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea))   |                                                                                                                                     |
| `label`    | String  | Alias for `el`. Labels the event.                                                                    | `el` ([Event Label](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el))    |                                                                                                                                     |
| `value`    | Integer | Alias for `ev`. Adds a metric to the event.                                                          | `ev` ([Event Value](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ev))    |                                                                                                                                     |

> For all other properties, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).
