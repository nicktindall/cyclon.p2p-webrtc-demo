'use strict';

var gauss = require("gauss");
var cyclon = require("cyclon.p2p");

/**
 * Starts a local simulation
 */
function LocalSimulationService($log, $interval) {

    function startSimulation(numNodes, cacheSize, shuffleLength, tickIntervalMs) {
        var localComms = new cyclon.LocalComms();
        var localBootstrapper = new cyclon.LocalBootstrapper(numNodes);
        var asyncExecService = new cyclon.AsyncExecService();
        var nodes = [];
        var neighbourSets = [];
        var round = 0;

        var loggingService = new cyclon.ConsoleLogger();

        for (var nodeId = 0; nodeId < numNodes; nodeId++) {
            var neighbourSet = new cyclon.NeighbourSet($log);
            var cyclonNode = new cyclon.builder(id, localComms, localBootstrap)
                                .withLogger($log)
                                .withAsyncExecService(asyncExecService);

            nodes.push(cyclonNode);
            neighbourSets.push(neighbourSet);
        }

        /**
         * Start all the nodes
         */
        nodes.forEach(function(node) {
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
            var allIds = localComms.getAllIds();

            neighbourSets.forEach(function (neighbourSet) {
                allIds.forEach(function (id) {
                    var increment = neighbourSet.contains(id) ? 1 : 0;
                    counts[id] = counts[id] === undefined ? increment : counts[id] + increment;
                });
            });

            var countsArray = [];
            var orphanCount = 0;
            for(var key in counts) {
                var countForKey = counts[key];
                countsArray.push(countForKey);
                if(countForKey === 0) {
                    orphanCount++;
                }
            }

            var statsVector = new window.gauss.Vector(countsArray);

            $log.debug(round + ": Mean inbound = " + statsVector.mean() + ", st.dev = " + statsVector.stdev() + ", orphans: "+orphanCount);
        }

        $interval(tick, tickIntervalMs);
    }

    return {
        'startSimulation' : startSimulation
    };
}

module.exports = LocalSimulationService;

