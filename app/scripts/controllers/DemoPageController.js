'use strict';

var SECONDS_BEFORE_RELOAD = 30;

function DemoPageController($interval, $log, $scope, OverlayService, ClientInfoService, VersionCheckService, RankingService) {

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
     * Determine if we're running in a supported browser
     */
    if(RTCPeerConnection) {
        $scope.browserIsUnsupported = false;
    }
    else {
        $scope.browserIsUnsupported = true;
    }

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

        $scope.newerVersionDetected = {
            localVersion: localVersion,
            remoteVersion: remoteVersion,
            secondsTilReload: SECONDS_BEFORE_RELOAD
        };

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

    $scope.$on("statsChanged", function (event, newStats) {
        $scope.$apply(function () {
            $scope.shuffleStats = newStats;
        });
    });

    $scope.$on("rankingsUpdated", function(event, rankings) {
        $scope.topNodes = rankings;
    });

    /**
     * When the client info changes, update it in the session store
     */
    $scope.$watch("clientInfo", function (newValue) {
        ClientInfoService.setClientInfo(newValue);
    });


    if (!$scope.browserIsUnsupported) {
        /**
         * Start the overlay
         */
        $log.info("Cyclon demo starting...");
        OverlayService.start();
    }
}

module.exports = DemoPageController;
