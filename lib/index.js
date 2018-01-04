const requestPromise = require('request-promise-native');

const cache = {};

/**
 * Retrieves a response for a given URL, caching it using an in-memory cache.
 * Options specify cache TTL and if stale cached reults can be returned in
 * cases of an error.
 *
 * @param {string} url: URL to retrieve a response from
 * @param {object} options: Options for the request
 * @param {number} options.ttl: Cache TTL, in milliseconds
 * @param {boolean} options.allowStale: true if stale result can be returned if request errors
 * @returns {string} Response from the URL
 */
module.exports = async (url, options = {}) => {
  const cachedObject = cache[url];
  const dateNow = Date.now();
  const ttl = options.ttl || 0;

  if (ttl && cachedObject && dateNow - cachedObject.retrievedAt < ttl) {
    // Found a fresh copy of the response in cache, return it
    return cachedObject.body;
  } else {
    await requestPromise(url).then((body) => {
      // Cache the response
      cachedObject.body = body;
      cachedObject.retrievedAt = dateNow;

      return body;
    }).catch((error) => {
      if (options.allowStale && cachedObject && cachedObject.body) {
        return cachedObject.body;
      } else {
        return '';
      }
    });
  }
};
