'use strict';

function ClientInfoService() {

    var infoKey = "cyclonDemoClientInfo";
    var idKey = "cyclonDemoClientId";
    var neighbourCacheKey = "cyclonDemoNeighbourCacheKey";

    return {

        getClientId: function() {
            return sessionStorage.getItem(idKey);
        },

        setClientId: function(value) {
            sessionStorage.setItem(idKey, value);
        },

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