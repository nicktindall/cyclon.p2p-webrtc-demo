"use strict";

var Utils = require("cyclon.p2p-common");

var ONE_HOUR_IN_MS = 1000 * 60 * 60;

function ShuffleStatsService($rootScope) {

    Utils.checkArguments(arguments, 1);

    var outgoingShuffleTally = 0,
        incomingShuffleTally = 0;

    // Outgoing stats
    var incomingTimeouts = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);
    var incomingErrors = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);
    var incomingSuccesses = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);

    // Incoming stats
    var outgoingTimeouts = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);
    var outgoingErrors = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);
    var outgoingSuccesses = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);
    var outgoingUnreachable = new TimeBasedSlidingWindow(ONE_HOUR_IN_MS);

    function updateShuffleTally(change, direction) {
        if (direction === "incoming") {
            incomingShuffleTally = incomingShuffleTally + change;
        }
        else if (direction === "outgoing") {
            outgoingShuffleTally = outgoingShuffleTally + change;
        }
        else {
            throw new Error("Unknown shuffle direction: " + direction);
        }
    }

    function updateEventCounter(incomingWindow, outgoingWindow, direction, node) {
        if (direction === "outgoing") {
            outgoingWindow.recordEvent(node);
        }
        else if (direction === "incoming") {
            incomingWindow.recordEvent(node);
        }
        else {
            throw new Error("Unknown direction encountered: " + direction);
        }
    }

    function handleShuffleStarted(direction) {
        updateShuffleTally(1, direction);
        $rootScope.$broadcast("statsChanged", getStats());
    }

    function handleShuffleError(direction, node, error) {
        updateShuffleTally(-1, direction);
        if (direction === "outgoing" && error === "unreachable") {
            outgoingUnreachable.recordEvent(node);
        }
        else {
            updateEventCounter(incomingErrors, outgoingErrors, direction, node);
        }
        $rootScope.$broadcast("statsChanged", getStats());
    }

    function handleShuffleTimeout(direction, node) {
        updateShuffleTally(-1, direction);
        updateEventCounter(incomingTimeouts, outgoingTimeouts, direction, node);
        $rootScope.$broadcast("statsChanged", getStats());
    }

    function handleShuffleCompleted(direction, node) {
        updateShuffleTally(-1, direction);
        updateEventCounter(incomingSuccesses, outgoingSuccesses, direction, node);
        $rootScope.$broadcast("statsChanged", getStats());
    }

    function getStats() {

        return {
            incoming: {
                outstanding: incomingShuffleTally,
                errors: incomingErrors.getEventCount(),
                timeouts: incomingTimeouts.getEventCount(),
                successes: incomingSuccesses.getEventCount()
            },
            outgoing: {
                outstanding: outgoingShuffleTally,
                errors: outgoingErrors.getEventCount(),
                timeouts: outgoingTimeouts.getEventCount(),
                successes: outgoingSuccesses.getEventCount(),
                unreachable: outgoingUnreachable.getEventCount()
            }
        }
    }

    return {
        shuffleCompletedHandler: handleShuffleCompleted,
        shuffleTimeoutHandler: handleShuffleTimeout,
        shuffleErrorHandler: handleShuffleError,
        shuffleStartedHandler: handleShuffleStarted,
        getStats: getStats
    };
}


function TimeBasedSlidingWindow(timeIntervalInMs) {

    var contents = [];

    this.recordEvent = function (remoteNodeId) {
        var now = new Date();
        pruneOldEvents(now);
        contents.push({
            date: now,
            remoteId: remoteNodeId
        });
    };

    function pruneOldEvents(now) {
        // Remove any timeouts over an hour old
        while (contents.length > 0 && (now.getTime() - contents[0].date.getTime()) > timeIntervalInMs) {
            contents.shift();
        }
    }

    this.getEventCount = function () {
        pruneOldEvents(new Date());
        return contents.length;
    }
}

module.exports = ShuffleStatsService;
