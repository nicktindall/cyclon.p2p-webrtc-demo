'use strict';

/**
 * Displays a table of the longest running nodes and the
 * time they've been running for
 */
function TopNodesTable() {

    return {
        restrict: 'E',
        scope: {
            leaders: '=leaders',
            myId: '=myId'
        },
        templateUrl: "views/top-nodes-table.html"
    };
}

module.exports = TopNodesTable;
