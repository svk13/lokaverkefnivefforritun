const axios = require('axios');
const express = require('express');

const router = express.Router();
const baseURL = 'https://apis.is';
const instance = axios.create({
  baseURL,
});


var descriptions = {
  'F'   : { 'is': 'Vindhraði (m/s)',
            'en': 'Wind speed (m/s)'},
  'FX'  : { 'is': 'Mesti vindhraði (m/s)',
            'en': 'Top wind speed (m/s)'},
  'FG'  : { 'is': 'Mesta vindhviða (m/s)',
            'en': 'Top wind gust (m/s)'},
  'D'   : { 'is': 'Vindstefna',
            'en': 'Wind direction'},
  'T'   : { 'is': 'Hiti (°C)',
            'en': 'Air temperature (°C)'},
  'W'   : { 'is': 'Veðurlýsing',
            'en': 'Weather description'},
  'V'   : { 'is': 'Skyggni (km)',
            'en': 'Visibility (km)'},
  'N'   : { 'is': 'Skýjahula (%)',
            'en': 'Cloud cover (%)'},
  'P'   : { 'is': 'Loftþrýstingur (hPa)',
            'en': 'Air pressure'},
  'RH'  : { 'is': 'Rakastig (%)',
            'en': 'Humidity (%)'},
  'SNC' : { 'is': 'Lýsing á snjó',
            'en': 'Snow description'},
  'SND' : { 'is': 'Snjódýpt',
            'en': 'Snow depth'},
  'SED' : { 'is': 'Snjólag',
            'en': 'Snow type'},
  'RTE' : { 'is': 'Vegahiti (°C)',
            'en': 'Road temperature (°C)'},
  'TD'  : { 'is': 'Daggarmark (°C)',
            'en': 'Dew limit (°C)'},
  'R'   : { 'is': 'Uppsöfnuð úrkoma (mm/klst) úr sjálfvirkum mælum',
            'en': 'Cumulative precipitation (mm/h) from automatic measuring units'}
};
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
      title: 'Veðrið',
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
	channel(req.params.choise, req.params.station)
  .then((result) => {
    const breyta = result.data.results;
    res.render('index', {
      title: `Veðrið`,
      ras: breyta,
	  rasir: cities,
	  desc: descriptions,
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
