'use strict';

var TEST_CHANNEL_TYPE = "testChannel";

var rtc = require("cyclon.p2p-rtc-client");
var Utils = require("cyclon.p2p-common");

function RTCService($log) {

    var asyncExecService = Utils.asyncExecService();
    var timingService = new rtc.TimingService();

    var redundantSignallingSocket = new rtc.RedundantSignallingSocket(
        new rtc.StaticSignallingServerService(JSON.parse('/* @echo SIGNALLING_SERVERS */')),
        new rtc.SocketFactory(),
        $log,
        asyncExecService,
        sessionStorage,
        timingService);

    var httpRequestService = new rtc.HttpRequestService();

    var signallingService = new rtc.SocketIOSignallingService(
        redundantSignallingSocket,
        $log,
        httpRequestService,
        sessionStorage);

    var rtcConn = new rtc.RTC(
        signallingService,
        new rtc.ChannelFactory(
            asyncExecService,
            new rtc.PeerConnectionFactory(
                timingService,
                new rtc.AdapterJsRTCObjectFactory(logger),
                asyncExecService,
                $log),
            signallingService,
            $log)
    );

    rtcConn.connect();
    rtcConn.onChannel(TEST_CHANNEL_TYPE, function() {
        $log.log("Test channel was established!");
    });

    return {
        getLocalPointer: function () {
            return rtcConn.createNewPointer();
        },

        connectToRemotePeer: function(remotePointer) {
            rtcConn.openChannel(TEST_CHANNEL_TYPE, remotePointer);
        }
    }
}

module.exports = RTCService;