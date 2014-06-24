'use strict';

var cyclonWebRtc = require("cyclon.p2p-webrtc-client");
var Utils = require("cyclon.p2p").Utils;

function OverlayService($log, $rootScope, guidService, frontendVersionService, locationProviderService, platformDetectionService, clientInfoService, shuffleStatsService) {

    Utils.checkArguments(arguments, 8);

    var CACHE_SIZE = 50,
        SHUFFLE_LENGTH = 10,
        TICK_INTERVAL_MS = 30000;

    var metadataProviders = {
        "location": locationProviderService.getLocation,
        "frontendVersion": frontendVersionService.getVersion,
        "platform": platformDetectionService.getPlatformInfo,
        "shuffleStats": shuffleStatsService.getStats,
        "clientInfo": clientInfoService.getClientInfo
    };

    var id = getId();
    var cyclonNode = cyclonWebRtc.builder(id)
                        .withPreferredNumberOfSockets(2)
                        .withLogger($log)
                        .withStorage(sessionStorage)
                        .withMetadataProviders(metadataProviders)
                        .withRTCObjectFactory(new cyclonWebRtc.AdapterJsRTCObjectFactory())
                        .withSignallingServers(JSON.parse('/* @echo SIGNALLING_SERVERS */'))
                        .build();
    
    var neighbourSet = cyclonNode.getNeighbourSet();

    setupNeighbourCacheSessionPersistence(neighbourSet);

    /**
     * Add listeners to Cyclon components to maintain state
     */
    cyclonNode.on("shuffleCompleted", updateLastShuffleStats);
    cyclonNode.on("attemptingBootstrap", recordBootstrap);
    neighbourSet.on("change", advertiseCacheChange);

    /**
     * Keep stats up to date
     */
    cyclonNode.on("shuffleCompleted", shuffleStatsService.shuffleCompletedHandler);
    cyclonNode.on("shuffleTimeout", shuffleStatsService.shuffleTimeoutHandler);
    cyclonNode.on("shuffleError", shuffleStatsService.shuffleErrorHandler);
    cyclonNode.on("shuffleStarted", shuffleStatsService.shuffleStartedHandler);

    function advertiseCacheChange(type, node) {
        $rootScope.$broadcast("cacheContentsChanged", neighbourSet.getContents());

        /**
         * On adds, check whether the remote client is using
         * a newer version of the frontend
         */
        if (type === "insert") {
            var remoteVersion = node.metadata.frontendVersion;
            var localVersion = frontendVersionService.getVersion();
            if (remoteVersion > localVersion) {
                $rootScope.$broadcast("newerVersionDetected", localVersion, remoteVersion);
            }
        }
    }

    /**
     * Apply last successful shuffle stats
     */
    function updateLastShuffleStats(direction, remoteNode) {
        $rootScope.$broadcast("shuffleOccurred", direction, remoteNode);
    }

    /**
     * Record that we attempted a bootstrap
     */
    function recordBootstrap() {
        $rootScope.$broadcast("bootstrapAttempted");
    }

    /**
     * Load the stored neighbour cache if its present then
     * start listening for changes to store
     */
    function setupNeighbourCacheSessionPersistence(neighbourSet) {
        var storedNeighbourCache = clientInfoService.getStoredNeighbourCache();
        if (storedNeighbourCache) {
            for (var nodeId in storedNeighbourCache) {
                neighbourSet.insert(storedNeighbourCache[nodeId]);
            }
        }

        neighbourSet.on("change", function () {
            clientInfoService.setStoredNeighbourCache(neighbourSet.getContents());
        });
    }

    /**
     * Get the client ID, checking first for a persisted ID in the session
     */
    function getId() {
        var id = null;
        var clientInfo = clientInfoService.getClientId();
        if (clientInfo !== null) {
            id = clientInfo;
        }
        else {
            id = guidService();
            clientInfoService.setClientId(id);
        }
        return id;
    }

    return {

        /**
         * Starts the cyclon overlay
         */
        start: function () {
            cyclonNode.start();
        },

        getNodeId: function () {
            return id;
        },

        getCacheContents: function () {
            return neighbourSet.getContents();
        }
    };
}

module.exports = OverlayService;

