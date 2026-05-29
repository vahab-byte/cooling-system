import NodeCache from "node-cache";
import logger from "../utils/logger.js";

// Standard cache duration: 5 minutes
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const apiCache = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.debug(`Cache hit for ${key}`);
      return res.status(200).json(cachedResponse);
    } else {
      logger.debug(`Cache miss for ${key}`);

      // Intercept res.json to store in cache before sending
      const originalJson = res.json;
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200 && body.success !== false) {
          cache.set(key, body, duration);
        }
        res.json = originalJson;
        return res.json(body);
      };

      next();
    }
  };
};

export const clearCache = (prefix = "") => {
  const keys = cache.keys();
  if (prefix) {
    const keysToDelete = keys.filter((k) => k.startsWith(prefix));
    cache.del(keysToDelete);
    logger.info(`Cleared cache for prefix: ${prefix}`);
  } else {
    cache.flushAll();
    logger.info("Cleared entire API cache");
  }
};
