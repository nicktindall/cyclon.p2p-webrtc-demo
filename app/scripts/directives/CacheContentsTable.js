'use strict';

/**
 * Displays a table of the cache contents
 */
function CacheContentsTable() {

    return {
        restrict: 'E',
        scope: {
            neighbourSet: '=cache'
        },
        templateUrl: "views/cache-contents-table.html"
    };
}

module.exports = CacheContentsTable;
