const axios = require('axios');
const express = require('express');

const router = new express.Router();
const baseURL = 'https://apis.is';
const instance = axios.create({
  baseURL,
});

/**
 * Fetches all available channels from endpoint, returns a promise that when
 * resolved returns an array, e.g.:
 * [{ name: 'Rúv', endpoint: '/tv/ruv' }, ... ]
 *
 * @returns {Promise} - Promise with available channels when resolved
 */
function channels() {
  return instance.get('/tv/');
}
/**
 * Fetches schedule for a channel by name, returns an array, e.g.:
 * [{ title: '...', duration: '...', startTime: '...', ...}, ...]
 * If the channel does not exist, the empty array is returned.
 *
 * @param {string} name - Name of the channel
 * @returns {Promise} - Promise with schedule for channel when resolved
 */
function channel(name) {
  const str = `/tv/${name}`;
  return instance.get(str);
}

router.get('/', (req, res) => {
  channels()
  .then((result) => {
    const breyta = result.data.results;
    res.render('index', {
      title: 'Íslenskar sjónvarpsstöðvar',
      rasir: breyta,
    });
  })
  .catch((error) => {
    res.render('error', {
      title: 'Úpps',
      error,
    });
  });
});

router.get('/event/:name2/:channels/:name', (req, res) => {
  channel(req.params.name)
  .then((result) => {
    const breyta = result.data.results;
    res.render('index', {
      title: `Dagskrá ${req.params.name2}`,
      ras: breyta,
    });
  })
  .catch((error) => {
    res.render('error', {
      title: 'Úpps',
      error,
    });
  });
});


module.exports = router;
