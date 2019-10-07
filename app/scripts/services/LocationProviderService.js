'use strict';

/**
 * Uses geojs.io to try and determine the users location
 *
 * See https://geojs.io/
 */
function LocationProviderService($log, $http) {

    var location = null;

    let URL = "https://get.geojs.io/v1/ip/geo.js";

    $http.jsonp(URL, {jsonpCallbackParam: 'callback'})
        .then(function(response) {
            location = response.data;
        })
        .catch(function(response) {
            $log.error("Unable to determine location (status code "+response.status+")");
        });

    return {
        getLocation: function() {
            return location;
        }
    };
}

module.exports = LocationProviderService;