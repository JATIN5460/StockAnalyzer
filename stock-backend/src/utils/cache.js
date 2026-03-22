// src/utils/cache.js
const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL:      parseInt(process.env.CACHE_TTL_SECONDS) || 60,
  checkperiod: 120,
  useClones:   false,
});

const get   = (key)           => cache.get(key);
const set   = (key, val, ttl) => ttl ? cache.set(key, val, ttl) : cache.set(key, val);
const del   = (key)           => cache.del(key);
const flush = ()              => cache.flushAll();
const stats = ()              => cache.getStats();

module.exports = { get, set, del, flush, stats };