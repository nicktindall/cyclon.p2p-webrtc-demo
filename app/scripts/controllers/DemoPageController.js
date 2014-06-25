'use strict';

var SECONDS_BEFORE_RELOAD = 30;
var REPORTING_INTERVAL_MS = 1000 * 60 * 2;

function DemoPageController($http, $interval, $log, $scope, OverlayService, ClientInfoService) {

    $scope.clientInfo = ClientInfoService.getClientInfo();
    if ($scope.clientInfo === null) {
        $scope.clientInfo = "";
    }
    $scope.overlayNodeId = OverlayService.getNodeId();
    $scope.lastSuccessfulIncomingShuffleWith = null;
    $scope.lastSuccessfulIncomingShuffle = null;

    $scope.lastSuccessfulOutgoingShuffleWith = null;
    $scope.lastSuccessfulOutgoingShuffle = null;

    $scope.newerVersionDetected = null;
    $scope.lastBootstrapAttempt = null;
    $scope.shuffleStats = {
        incoming: {
            errors: 0,
            timeouts: 0,
            successes: 0
        },
        outgoing: {
            errors: 0,
            timeouts: 0,
            successes: 0,
            unreachable: 0
        }
    };
    $scope.cacheContents = OverlayService.getCacheContents();

    /**
     * Listen for cache contents changes
     */
    $scope.$on("cacheContentsChanged", function (event, newContents) {
        $scope.$apply(function () {
            $scope.cacheContents = newContents;
        });
    });

    /**
     * Listen for shuffles, update shuffle stats
     */
    $scope.$on("shuffleOccurred", function (event, direction, withNode) {
        $scope.$apply(function () {
            if (direction === "incoming") {
                $scope.lastSuccessfulIncomingShuffle = new Date();
                $scope.lastSuccessfulIncomingShuffleWith = withNode;
            }
            else if (direction === "outgoing") {
                $scope.lastSuccessfulOutgoingShuffle = new Date();
                $scope.lastSuccessfulOutgoingShuffleWith = withNode;
            }
        });
    });

    $scope.$on("newerVersionDetected", function (event, localVersion, remoteVersion) {

        //
        // Only respond the first time it's detected
        //
        if ($scope.newerVersionDetected !== null) {
            return;
        }

        $scope.$apply(function () {
            $scope.newerVersionDetected = {
                localVersion: localVersion,
                remoteVersion: remoteVersion,
                secondsTilReload: SECONDS_BEFORE_RELOAD
            };
        });

        //
        // Reload in SECONDS_BEFORE_RELOAD seconds
        //
        $interval(function () {
            if (--$scope.newerVersionDetected.secondsTilReload === 0) {
                location.reload(true);
            }
        }, 1000, SECONDS_BEFORE_RELOAD);
    });

    $scope.$on("bootstrapAttempted", function () {
        $scope.$apply(function () {
            $scope.lastBootstrapAttempt = new Date();
        });
    });

    $scope.$on("statsChanged", function(event, newStats) {
        $scope.$apply(function() {
            $scope.shuffleStats = newStats;
        });
    });

    /**
     * When the client info changes, update it in the session store
     */
    $scope.$watch("clientInfo", function (newValue) {
        ClientInfoService.setClientInfo(newValue);
    });

    /**
     * Start the overlay
     */
    $log.info("Cyclon demo starting...");
    OverlayService.start();

    /**
     * Periodically publish the local node state (for analysis)
     */
    $interval(function() {
        $http.post('http://cyclon-datastore.appspot.com/dumpstats', {
            neighbours: $scope.cacheContents,
            node: OverlayService.getCyclonNode().createNewPointer()
        })
        .success(function() {
            $log.info("Reported stats for analysis");
        })
        .error(function(err) {
            $log.warn("An error occurred dumping the stats", err);
        });
    }, REPORTING_INTERVAL_MS);
}

module.exports = DemoPageController;
