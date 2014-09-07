'use strict';

function LocalSimulationController($scope, LocalSimulationService) {

    $scope.numberOfNodes = 1000;
    $scope.cacheSize = 20;
    $scope.shuffleLength = 5;
    $scope.tickIntervalMs = 1000;
    $scope.lastStats = null;

    LocalSimulationService.startSimulation(
        $scope.numberOfNodes,
        $scope.cacheSize,
        $scope.shuffleLength,
        $scope.tickIntervalMs);

    $scope.$on("localSimulationStats", function(e, stats) {
        $scope.lastStats = stats;
    });
}

module.exports = LocalSimulationController;