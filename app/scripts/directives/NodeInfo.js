'use strict';

/**
 * Displays the info of one node
 */
function NodeInfo() {

    return {
        restrict: 'E',
        scope: {
            node: '=node'
        },
        templateUrl: "views/node-info.html"
    };
}

module.exports = NodeInfo;
