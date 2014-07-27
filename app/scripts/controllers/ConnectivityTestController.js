'use strict';

function ConnectivityTestController($timeout, $scope, RTCService) {

    $scope.localPointer = null;
    $scope.remotePointer = null;

    $scope.refreshLocalPointer = function() {
        $scope.localPointer = RTCService.getLocalPointer();
    };

    $scope.connectTo = function() {
        RTCService.connectToRemotePeer(JSON.parse($scope.remotePointer));
    };

    $timeout(function() {
        $scope.refreshLocalPointer();
    }, 1000);
}

module.exports = ConnectivityTestController;