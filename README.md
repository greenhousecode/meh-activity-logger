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
    req.event({
      cid: '35009a79-1a05-49d7-b876-2b884d0f825b',
      ec: 'Category',
      ea: 'Action',
    });
  })
  .listen(3000);
```

Or directly:

```js
import express from 'express';
import activityLogger from 'meh-activity-logger';

const event = activityLogger({ tid: 'UA-XXXXXX-X' });

express()
  .get('/', event({ cid: '35009a79-1a05-49d7-b876-2b884d0f825b', ec: 'Category', ea: 'Action' }))
  .listen(3000);
```

## API

### `activityLogger({ ... })`

- Returns: `Function` (`event()`)

Sets initial properties for all GA events.

| Key   | Description                                                                                                   | Default value                                        |
| ----- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `v`   | [Protocol Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v)     | `"1"`                                                |
| `aid` | [Application ID](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid)     | _`name` value from your project's `package.json`_    |
| `av`  | [Application Version](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av) | _`version` value from your project's `package.json`_ |

_For all other options, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)._

#### `event({ ... })`

- Returns: `Promise<void>`

Overrides initial properties, and fires a custom event to Google Analytics.

| Key   | Description                                                                                                         | Default value                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `t`   | [Hit Type](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t)                   | `"event"`                                                                                                   |
| `dp`  | [Document Path](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp)             | _`req.originalUrl`_                                                                                         |
| `dr`  | [Document Referrer](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr)         | _`req.get('referer')`_                                                                                      |
| `ua`  | [User Agent Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua)       | _`req.get('user-agent')`_                                                                                   |
| `uip` | [IP Override](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip) (Anonymized) | _`req.connection.remoteAddress || req.socket.remoteAddress || req.get['x-forwarded-for'].split(',').pop()`_ |

_For all other options, see [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)._
