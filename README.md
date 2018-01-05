# request-promise-response-cache

Middleware for `request-promise` that caches responses using an in-memory cache. Made for simple storage of service calls in Node.js.

```
npm install request-promise-response-cache
```

## Using Middleware

The simplest usage is to pass call this module with a URL and an optional options object.

```
const requestPromiseResponseCache = require('request-promise-response-cache');

const url = 'https://www.google.com';
const requestOptions = {
  maxAge: 86400000, // 1 day in ms
  allowStale: true,
};

async () => {
  const resultBody = await requestPromiseResponseCache(url, options);

  console.log(resultBody);
};
```

## Options

* `maxAge: number`, the maximum age in milliseconds for a response to return from the cache. This is the TTL for the cache, but can be sent on each call to the library. Defaults to `0`.
* `allowStale: boolean`, in case the service request fails, should a stale response be returned to the user? Defaults to `false`.

## License

MIT
