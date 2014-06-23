'use strict';

/**
 * Uses freegeoip.net to try and determine the users location
 *
 * See http://www.freegeoip.net/
 */
function LocationProviderService($log, $http) {

    var location = null;

    $http.jsonp("http://freegeoip.net/json/?callback=JSON_CALLBACK")
        .success(function(data) {
            location = data;
        })
        .error(function(data, status) {
            $log.error("Unable to determine location (status code "+status+")");
        });

    return {
        getLocation: function() {
            return location;
        }
    };
}

module.exports = LocationProviderService;