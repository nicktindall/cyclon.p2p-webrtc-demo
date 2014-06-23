"use strict";

function IncomingSuccessRateFilter() {

    return function (nodeStats) {

        var incomingStats = nodeStats.incoming;
        var total = incomingStats.errors + incomingStats.timeouts + incomingStats.successes;
        if (total > 0) {
            return Math.floor((incomingStats.successes / total) * 100) + "%";
        }
        else {
            return "N/A";
        }
    }
}

module.exports = IncomingSuccessRateFilter;