'use strict';

var ONE_HOUR_IN_MS = 1000 * 60 * 60;

function RankingService($rootScope, $interval, OverlayService, SessionInformationService) {

    var myId = OverlayService.getNodeId();
    var neighbourSet = OverlayService.getCyclonNode().getNeighbourSet();
    var startTime = SessionInformationService.getStartTime();

    var witnessedPeers = {};

    neighbourSet.on("change", function (type, node) {
        if (type === "insert" || type === "update") {
            processNode(node);
        }
    });

    function processNode(node) {
        var utcNow = SessionInformationService.currentTimeInUTC();
        if(!witnessedPeers.hasOwnProperty(node.id)) {
            // We've never seen this node before, add it to our list
            witnessedPeers[node.id] = {
                node: node,
                startTime: node.metadata.sessionInfo.startTime,
                lastSeen: utcNow
            };
        }
        else {
            // We've seen this node before, update the last-seen time
            witnessedPeers[node.id].lastSeen = utcNow;
        }
    }

    function pruneOldNodes() {
        var oneHourAgoInUTC = SessionInformationService.currentTimeInUTC() - ONE_HOUR_IN_MS;
        for(var nodeId in witnessedPeers) {
            if(witnessedPeers[nodeId].lastSeen < oneHourAgoInUTC) {
                delete witnessedPeers[nodeId];
            }
        }
    }

    function getStartTime(nodeId) {
        if(nodeId === myId) {
            return startTime;
        }
        else {
            return witnessedPeers[nodeId].startTime;
        }
    }

    function getNodePointer(nodeId) {
        if(nodeId === myId) {
            return OverlayService.getCyclonNode().createNewPointer();
        }
        else {
            return witnessedPeers[nodeId].node;
        }
    }

    $interval(function() {
        pruneOldNodes();
        var sortedPeerNodes = Object.keys(witnessedPeers).concat([myId]).sort(function(idOne, idTwo) {
            return getStartTime(idOne) - getStartTime(idTwo);
        }).map(getNodePointer).slice(0, 20);

        $rootScope.$broadcast("rankingsUpdated", sortedPeerNodes);

    }, 60000);
}

module.exports = RankingService;