'use strict';
(function () {

    var net = require('net');
    var querystring = require('querystring');

    /**
     * Constructor
     */
    var MapQuestGeocoder = function(httpAdapter, apiKey) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('MapQuest Geocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;

        if (!apiKey || apiKey == 'undefinded') {

            throw new Error('MapQuest Geocoder need an apiKey');
        }

        this.apiKey = apiKey;
    };

    MapQuestGeocoder.prototype._endpoint = 'http://www.mapquestapi.com/geocoding/v1';

    MapQuestGeocoder.prototype.geocode = function(value, callback) {

        if (net.isIP(value)) {
            throw new Error('MapQuest Geocoder no suport geocoding ip');
        }

        var _this = this;
        this.httpAdapter.get(this._endpoint + '/address' , { 'location' : value, 'key' : querystring.unescape(this.apiKey)}, function(err, result) {
            if (err) {
                throw err;
            } else {
                var results = [];

                var locations = result.results[0].locations;

                for(var i = 0; i < locations.length; i++) {
                    results.push(_this._formatResult(locations[i]));
                }

                callback(false, results);
            }
        });
    };

    MapQuestGeocoder.prototype._formatResult = function(result) {

        return {
            'latitude' : result.latLng.lat,
            'longitude' : result.latLng.lng,
            'country' : null,
            'city' : result.adminArea5,
            'zipcode' : result.postalCode,
            'streetName': result.street,
            'streetNumber' : null,
            'countryCode' : result.adminArea1

        };
    };

    MapQuestGeocoder.prototype.reverse = function(lat, lng, callback) {

        var _this = this;

        this.httpAdapter.get(this._endpoint + '/reverse' , { 'location' : lat + ',' + lng, 'key' : querystring.unescape(this.apiKey)}, function(err, result) {
            if (err) {
                throw err;
            } else {
                var results = [];

                var locations = result.results[0].locations;

                for(var i = 0; i < locations.length; i++) {
                    results.push(_this._formatResult(locations[i]));
                }

                callback(false, results);
            }
        });
    };

    module.exports = MapQuestGeocoder;
    
})();