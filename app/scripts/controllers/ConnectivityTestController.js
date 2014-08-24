'use strict';

function ConnectivityTestController($timeout, $scope, RTCService) {

    $scope.localPointer = null;
    $scope.remotePointer = null;
    $scope.log = [];

    $scope.refreshLocalPointer = function () {
        $scope.localPointer = JSON.stringify(RTCService.getLocalPointer(), null, 2);
    };

    $scope.connectTo = function () {
        try {
            var remotePeer = parseAndValidate($scope.remotePointer);
        }
        catch (e) {
            $scope.log.push("Invalid pointer: " + e.message);
        }

        if (remotePeer) {
            $scope.log.push("Connecting to " + remotePeer.id);
            var startTime = new Date().getTime();
            RTCService.connectToRemotePeer(remotePeer)
                .then(function () {
                    $scope.$apply(function () {
                        var now = new Date().getTime();
                        $scope.log.push("Connected to " + remotePeer.id + " in " + (now - startTime) + "ms");
                    });
                })
                .catch(function (e) {
                    $scope.$apply(function () {
                        $scope.log.push("Failed to connect to " + remotePeer.id + " (" + e.message + ")");
                    })
                });
        }
    };

    $scope.$on("connectivityTest-incomingConnection", function (e, remotePeer) {
        $scope.$apply(function () {
            $scope.log.push("Incoming connection established (from " + remotePeer.id + ")");
        });
    });

    $scope.clearLogs = function () {
        $scope.log = [];
    };

    $timeout(function () {
        $scope.refreshLocalPointer();
    }, 1000);

    function parseAndValidate(pointer) {
        var pointerObject = JSON.parse(pointer);
        validate(pointerObject);
        return pointerObject;
    }

    function validate(pointerObject) {
        if (pointerObject) {
            if (typeof(pointerObject.id) !== "string") {
                throw new Error("Invalid or missing ID");
            }

            if (typeof(pointerObject.seq) !== "number") {
                throw new Error("Invalid or missing sequence number");
            }

            if (typeof(pointerObject.signalling) !== "object" || !(pointerObject.signalling instanceof Array)) {
                throw new Error("Invalid or missing signalling data");
            }
        }
        else {
            throw new Error("Missing pointer data");
        }
    }
}

module.exports = ConnectivityTestController;