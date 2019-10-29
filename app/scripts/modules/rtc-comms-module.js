const {
    WebRTCComms,
    ShuffleStateFactory,
    SignallingServerBootstrap
} = require("cyclon.p2p-rtc-comms");

function buildRTCCommsModule(angular) {
    const ROOMS_TO_JOIN = ['CyclonP2PWebRtcDemo-bffa263e-159d-4fab-8bc6-340fb9b65820'];
    const rtcCommsModule = angular.module("cyclon-rtc-comms", ["cyclon-rtc"]);
    rtcCommsModule.service("Comms", ["RTC", "ShuffleStateFactory", "$log", "ROOMS_TO_JOIN", WebRTCComms]);
    rtcCommsModule.service("ShuffleStateFactory", ["$log", "AsyncExecService", ShuffleStateFactory]);
    rtcCommsModule.service("Bootstrap", ["SignallingSocket", "HttpRequestService", "ROOMS_TO_JOIN", SignallingServerBootstrap]);
    rtcCommsModule.constant("ROOMS_TO_JOIN", ROOMS_TO_JOIN);
    return rtcCommsModule;
}

module.exports = buildRTCCommsModule;