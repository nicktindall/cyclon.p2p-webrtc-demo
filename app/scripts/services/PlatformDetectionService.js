'use strict';

var bowser = require("bowser");

/**
 * Uses the bowser library to detect the browser
 *
 * See https://github.com/ded/bowser
 */
function PlatformDetectionService() {

    return {
        getPlatformInfo: function() {
            return  {
                name: bowser.browser.name,
                version: bowser.browser.version,
                os: navigator.platform
            };
        }
    };
}

module.exports = PlatformDetectionService;