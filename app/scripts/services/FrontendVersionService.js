'use strict';

var currentVersion = require("../../../AppMetadata").FRONTEND_VERSION;

/**
 * This is where we store the current version number
 * of the client, it's used so nodes can detect when
 * newer versions are available so they can refresh
 */
function FrontendVersionService() {

    return {
        getVersion: function() {
            return currentVersion;
        }
    };
}

module.exports = FrontendVersionService;
