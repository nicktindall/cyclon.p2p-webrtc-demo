"use strict";

function OutgoingSuccessRateFilter() {

    return function (nodeStats) {

        if(nodeStats) {
            var outgoingStats = nodeStats.outgoing;
            var total = outgoingStats.errors + outgoingStats.timeouts + outgoingStats.successes + outgoingStats.unreachable;
            if (total > 0) {
                return Math.floor((outgoingStats.successes / total) * 100) + "%";
            }
            else {
                return "N/A";
            }
        }
        else {
            return "Error";
        }
    }
}

module.exports = OutgoingSuccessRateFilter;
