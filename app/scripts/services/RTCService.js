'use strict';

var TEST_CHANNEL_TYPE = "testChannel";

var rtc = require("cyclon.p2p-rtc-client");
var Utils = require("cyclon.p2p-common");

function RTCService($log, StorageService, IceServers, SignallingServers) {

    var asyncExecService = Utils.asyncExecService();

    var redundantSignallingSocket = new rtc.RedundantSignallingSocket(
        new rtc.StaticSignallingServerService(SignallingServers),
        new rtc.SocketFactory(),
        $log,
        asyncExecService,
        StorageService,
        new rtc.TimingService());

    var httpRequestService = new rtc.HttpRequestService();

    var signallingService = new rtc.SocketIOSignallingService(
        redundantSignallingSocket,
        $log,
        httpRequestService,
        StorageService);

    var rtcConn = new rtc.RTC(
        signallingService,
        new rtc.ChannelFactory(
            asyncExecService,
            new rtc.PeerConnectionFactory(
                new rtc.AdapterJsRTCObjectFactory($log),
                asyncExecService,
                $log,
                IceServers),
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