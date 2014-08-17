'use strict';

var TEST_CHANNEL_TYPE = "testChannel";

var Utils = require("cyclon.p2p-common");

function RTCService(RTC, $log) {

    Utils.checkArguments(arguments, 2);

    RTC.connect();
    RTC.onChannel(TEST_CHANNEL_TYPE, function() {
        $log.log("Test channel was established!");
    });

    return {
        getLocalPointer: function () {
            return RTC.createNewPointer();
        },

        connectToRemotePeer: function(remotePointer) {
            RTC.openChannel(TEST_CHANNEL_TYPE, remotePointer);
        }
    }
}

module.exports = RTCService;