const nodeGeocoder = require("node-geocoder");
const options = {
	provider: process.env.PROVIDER,
	apiKey: process.env.APIKEY,
	formatter: null,
};

const Geocoder = nodeGeocoder(options);

module.exports = Geocoder;
