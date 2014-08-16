'use strict';

var STARTED_TIME_STORAGE_KEY = "cyclonDemo-RankingService-startedTime";

function SessionInformationService(StorageService) {

    var startedTimeInUTC = StorageService.getItem(STARTED_TIME_STORAGE_KEY);
    if (startedTimeInUTC == null) {
        startedTimeInUTC = currentTimeInUTC();
        StorageService.setItem(STARTED_TIME_STORAGE_KEY, startedTimeInUTC);
    }

    function currentTimeInUTC() {
        var now = new Date();
        return now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    }

    return {
        getStartTime: function () {
            return startedTimeInUTC;
        },

        getMetadata: function () {
            return {
                startTime: startedTimeInUTC
            }
        },

        currentTimeInUTC: currentTimeInUTC
    }
}

module.exports = SessionInformationService;