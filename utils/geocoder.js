const nodeGeocoder = require("node-geocoder");
const confi = require('../secret')

const options = {
	provider: confi.provider,
	apiKey: confi.apiKey,
	formatter: null,
};

const Geocoder = nodeGeocoder(options);

module.exports = Geocoder;
