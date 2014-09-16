'use strict';

var TEST_CHANNEL_TYPE = "testChannel";

var Utils = require("cyclon.p2p-common");

function RTCService(RTC, $log, $rootScope) {

    Utils.checkArguments(arguments, 3);

    RTC.connect();
    RTC.onChannel(TEST_CHANNEL_TYPE, function(channel) {
        try {
            $log.log("Test channel was established!");
            $rootScope.$broadcast("connectivityTest-incomingConnection", channel.getRemotePeer());
        }
        finally {
            channel.close();
        }
    });

    return {
        getLocalPointer: function () {
            return RTC.createNewPointer();
        },

        connectToRemotePeer: function(remotePointer) {
            return RTC.openChannel(TEST_CHANNEL_TYPE, remotePointer)
                .then(function(channel) {
                    channel.close();
                });
        }
    }
}

module.exports = RTCService;