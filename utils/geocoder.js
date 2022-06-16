const nodeGeocoder = require('node-geocoder');
// const confi = require("../security");
require('dotenv').config();

const options = {
	provider: 'mapquest',
	httpAdapter: 'https',
	apiKey: process.env.apiKey,
	formatter: null,
};

const Geocoder = nodeGeocoder(options);

module.exports = Geocoder;
