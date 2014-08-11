var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;

/**
 * "Pretty print" the node's running time if its present
 */
function RunningTimeFilter(sessionInformationService) {

    return function (node) {

        var nodeStartTime = node.metadata.sessionInfo.startTime;
        if (nodeStartTime) {
            var currentTimeUtc = sessionInformationService.currentTimeInUTC();
            var sessionDuration = currentTimeUtc - nodeStartTime;
            var hours = Math.floor(sessionDuration / ONE_HOUR);
            var minutes = Math.floor((sessionDuration % ONE_HOUR) / ONE_MINUTE);
            var seconds = Math.floor((sessionDuration % ONE_MINUTE) / ONE_SECOND);
            return hours + ":" + pad(minutes) + ":" + pad(seconds);
        }
        else {
            return "N/A";
        }
    };

    function pad(number) {
        return ("00" + number).slice(-2);
    }
}

module.exports = RunningTimeFilter;