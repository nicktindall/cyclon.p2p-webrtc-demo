'use strict';

function RemoteNodePointerPanel() {
    return {
        restrict: 'E',
        templateUrl: "views/remote-node-pointer-panel.html",
        scope: {
            content: "=content"
        }
    };
}

module.exports = RemoteNodePointerPanel;
