'use strict';

var STARTED_TIME_STORAGE_KEY = "cyclonDemo-RankingService-startedTime";

function SessionInformationService() {

    var startedTimeInUTC = sessionStorage.getItem(STARTED_TIME_STORAGE_KEY);
    if (startedTimeInUTC == null) {
        startedTimeInUTC = currentTimeInUTC();
        sessionStorage.setItem(STARTED_TIME_STORAGE_KEY, startedTimeInUTC);
    }

    function currentTimeInUTC() {
        var now = new Date();
        return now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    }

    return {
        getStartTime: function() {
            return startedTimeInUTC;
        },

        getMetadata: function() {
            return {
                startTime: startedTimeInUTC
            }
        },

        currentTimeInUTC: currentTimeInUTC
    }
}

module.exports = SessionInformationService;