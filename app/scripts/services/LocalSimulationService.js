'use strict';

var gauss = require("gauss");
var cyclon = require("cyclon.p2p");
var Utils = require("cyclon.p2p-common");

/**
 * Starts a local simulation
 */
function LocalSimulationService($rootScope, $log, $interval) {

    function startSimulation(numNodes, cacheSize, shuffleLength, tickIntervalMs) {
        var allNodes = {};
        var localBootstrap = new cyclon.LocalBootstrap(numNodes);
        var nodes = [];
        var neighbourSets = [];
        var round = 0;

        for (var nodeId = 0; nodeId < numNodes; nodeId++) {
            var cyclonNode = new cyclon.builder(new cyclon.LocalComms(String(nodeId), allNodes), localBootstrap)
                .withLogger($log)
                .withNumNeighbours(cacheSize)
                .withShuffleSize(shuffleLength)
                .withTickIntervalMs(tickIntervalMs)
                .build();

            nodes.push(cyclonNode);
            neighbourSets.push(cyclonNode.getNeighbourSet());
        }

        /**
         * Start all the nodes
         */
        nodes.forEach(function (node) {
            node.start();
        });

        function tick() {
            round++;
            printNetworkStatistics();
        }

        /**
         * Calculate the average inbound pointer count
         *
         * @returns {number}
         */
        function printNetworkStatistics() {
            var counts = {};

            neighbourSets.forEach(function (neighbourSet) {
                for (var id in allNodes) {
                    var increment = neighbourSet.contains(id) ? 1 : 0;
                    counts[id] = counts[id] === undefined ? increment : counts[id] + increment;
                }
            });

            var countsArray = [];
            var orphanCount = 0;
            for (var key in counts) {
                var countForKey = counts[key];
                countsArray.push(countForKey);
                if (countForKey === 0) {
                    orphanCount++;
                }
            }

            var statsVector = new window.gauss.Vector(countsArray);

            $rootScope.$broadcast("localSimulationStats", {
                round: round,
                inboundMean: statsVector.mean(),
                inboundStdDev: statsVector.stdev(),
                orphans: orphanCount
            });
            $log.info(round + ": Mean inbound = " + statsVector.mean() + ", st.dev = " + statsVector.stdev() + ", orphans: " + orphanCount);
        }

        $interval(tick, tickIntervalMs);
    }

    return {
        'startSimulation': startSimulation
    };
}

module.exports = LocalSimulationService;

