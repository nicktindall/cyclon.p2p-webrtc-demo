const {
    WebRTCComms,
    ShuffleStateFactory,
    SignallingServerBootstrap
} = require("cyclon.p2p-rtc-comms");

function buildRTCCommsModule(angular) {
    const rtcCommsModule = angular.module("cyclon-rtc-comms", ["cyclon-rtc"]);
    rtcCommsModule.service("Comms", ["RTC", "ShuffleStateFactory", "$log", WebRTCComms]);
    rtcCommsModule.service("ShuffleStateFactory", ["$log", "AsyncExecService", ShuffleStateFactory]);
    rtcCommsModule.service("Bootstrap", ["SignallingSocket", "HttpRequestService", SignallingServerBootstrap]);
    return rtcCommsModule;
}

module.exports = buildRTCCommsModule;