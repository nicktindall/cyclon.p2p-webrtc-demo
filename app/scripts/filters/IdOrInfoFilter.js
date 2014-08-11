"use strict";

/**
 * Display the node's user info if its present or ID otherwise
 */
function IdOrInfoFilter() {

    return function (node) {
        var clientInfo = node.metadata.clientInfo;
        return (clientInfo && clientInfo.trim().length > 0) ? clientInfo : node.id;
    }
}

module.exports = IdOrInfoFilter;