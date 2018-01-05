const requestPromise = require('request-promise-native');

const cache = {};

/**
 * Retrieves a response for a given URL, caching it using an in-memory cache.
 * Options specify cache TTL and if stale cached reults can be returned in
 * cases of an error.
 *
 * @param {string} url: URL to retrieve a response from
 * @param {object} options: Options for the request
 * @param {number} options.maxAge: Cache TTL, in milliseconds, specified per call
 * @param {boolean} options.allowStale: true if stale result can be returned if request errors
 * @returns {string} Response from the URL
 */
module.exports = async (url, options = {}) => {
  cache[url] = cache[url] || {};

  let cachedObject = cache[url];
  const dateNow = Date.now();
  const maxAge = options.maxAge || 0;

  if (!(maxAge && cachedObject && dateNow - cachedObject.retrievedAt < maxAge)) {
    await requestPromise(url).then((body) => {
      // Cache the response
      cachedObject.body = body;
      cachedObject.retrievedAt = dateNow;
    }).catch(() => {
      if (!options.allowStale) {
        // Since we can't return a stale response, make sure we're returning empty
        cachedObject = {
          body: '',
        };
      }
    });
  }

  return cachedObject.body;
};
