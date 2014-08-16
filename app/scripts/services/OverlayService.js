'use strict';

var cyclonWebRtc = require("cyclon.p2p-rtc-comms");
var Utils = require("cyclon.p2p-common");

function OverlayService($log, $rootScope, guidService, frontendVersionService, locationProviderService,
                        platformDetectionService, clientInfoService, shuffleStatsService,
                        sessionInformationService, Storage) {

    Utils.checkArguments(arguments, 10);

    var metadataProviders = {
        "location": locationProviderService.getLocation,
        "frontendVersion": frontendVersionService.getVersion,
        "platform": platformDetectionService.getPlatformInfo,
        "shuffleStats": shuffleStatsService.getStats,
        "clientInfo": clientInfoService.getClientInfo,
        "sessionInfo": sessionInformationService.getMetadata
    };

    var cyclonNode = cyclonWebRtc.create($log, metadataProviders, JSON.parse('/* @echo SIGNALLING_SERVERS */'), Storage);
    var id = cyclonNode.getId();

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
        },

        getCyclonNode: function() {
            return cyclonNode;
        }
    };
}

module.exports = OverlayService;
