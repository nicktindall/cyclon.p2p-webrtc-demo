'use strict';

var Utils = require("cyclon.p2p-common");

function StorageService() {
    return Utils.obfuscateStorage(sessionStorage);
}

module.exports = StorageService;