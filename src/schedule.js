const axios = require('axios');
const express = require('express');

const router = express.Router();
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
  return instance.get('/weather/getAvailableStations');
}
/**
 * Fetches schedule for a channel by name, returns an array, e.g.:
 * [{ title: '...', duration: '...', startTime: '...', ...}, ...]
 * If the channel does not exist, the empty array is returned.
 *
 * @param {string} name - Name of the channel
 * @returns {Promise} - Promise with schedule for channel when resolved
 */
function channel(choise,svaedi) {
	console.log(choise);
	const str = `/weather/${choise}/is?stations=${svaedi}`;
		return instance.get(str);
}

router.get('/', (req, res) => {
  channels()
  .then((result) => {
    const breyta = result.data.results;
	const cities=[];
	for(i=0; i<breyta.length; i++){
		console.log(breyta[i].name);
		cities[i]=[breyta[i].name];
	};

    res.render('layout', {
      title: 'Veður',
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



router.get('/event/:choise/:station', (req, res) => {
	  channels()
  .then((result) => {
    const cities = result.data.results;
	console.log('hæhæhæhææh');
	channel(req.params.choise, req.params.station)
  .then((result) => {
    const breyta = result.data.results;
    res.render('index', {
      title: `Val`,
      ras: breyta,
	  rasir: cities,
    });
  })
  .catch((error) => {
    res.render('error', {
      title: 'Úpps',
      error,
    });
  });  
  })
	
});


module.exports = router;
