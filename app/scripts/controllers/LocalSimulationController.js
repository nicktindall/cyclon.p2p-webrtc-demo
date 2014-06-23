'use strict';

function LocalSimulationController(LocalSimulationService) {

    var NUM_NODES = 1000, CACHE_SIZE = 50, SHUFFLE_LENGTH = 10, TICK_INTERVAL_MS = 1000;

    LocalSimulationService.startSimulation(NUM_NODES, CACHE_SIZE, SHUFFLE_LENGTH, TICK_INTERVAL_MS);
}

module.exports = LocalSimulationController;