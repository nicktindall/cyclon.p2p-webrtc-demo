'use strict';

/**
 * This is where we store the current version number
 * of the client, it's used so nodes can detect when
 * newer versions are available so they can refresh
 */
function FrontendVersionService() {

    var CURRENT_VERSION = 27;

    return {
        getVersion: function() {
            return CURRENT_VERSION;
        }
    };
}

module.exports = FrontendVersionService;