'use strict';

function ClientInfoService() {

    var infoKey = "cyclonDemoClientInfo";
    var neighbourCacheKey = "cyclonDemoNeighbourCacheKey";

    return {

        getClientInfo: function () {
            return sessionStorage.getItem(infoKey);
        },

        setClientInfo: function (value) {
            sessionStorage.setItem(infoKey, value);
        },

        getStoredNeighbourCache: function() {
            var storedValue = sessionStorage.getItem(neighbourCacheKey);
            return storedValue ? JSON.parse(storedValue) : null;
        },

        setStoredNeighbourCache: function(value) {
            sessionStorage.setItem(neighbourCacheKey, JSON.stringify(value));
        }
    };
}

module.exports = ClientInfoService;