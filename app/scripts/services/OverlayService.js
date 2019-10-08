'use strict';

var {NeighbourSet, CyclonNodeImpl} = require("cyclon.p2p");
var Utils = require("cyclon.p2p-common");

var CACHE_SIZE = 20;
var BOOTSTRAP_SIZE = 5;
var SHUFFLE_SIZE = 5;
var TICK_INTERVAL_MS = 30000;

function OverlayService($log, $rootScope, frontendVersionService, locationProviderService,
                        platformDetectionService, clientInfoService, shuffleStatsService,
                        sessionInformationService, Storage, Comms, Bootstrap, AsyncExecService) {

    Utils.checkArguments(arguments, 12);

    var metadataProviders = {
        "location": locationProviderService.getLocation,
        "frontendVersion": frontendVersionService.getVersion,
        "platform": platformDetectionService.getPlatformInfo,
        "shuffleStats": shuffleStatsService.getStats,
        "clientInfo": clientInfoService.getClientInfo,
        "sessionInfo": sessionInformationService.getMetadata
    };

    var neighbourSet = new NeighbourSet($log);
    var cyclonNode = new CyclonNodeImpl(neighbourSet, CACHE_SIZE, BOOTSTRAP_SIZE, SHUFFLE_SIZE, Comms, Bootstrap, TICK_INTERVAL_MS, metadataProviders, AsyncExecService, $log);
    var id = cyclonNode.getId();

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
        $rootScope.$broadcast("cacheContentsChanged", getCacheContentsAsObject());
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

    function getCacheContentsAsObject() {
        return Array.from(neighbourSet.getContents().entries()).reduce(
            (previous, next) => {
                previous[next[0]] = next[1];
                return previous;
            }, {}
        );
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
            return getCacheContentsAsObject();
        },

        getCyclonNode: function() {
            return cyclonNode;
        }
    };
}

module.exports = OverlayService;
