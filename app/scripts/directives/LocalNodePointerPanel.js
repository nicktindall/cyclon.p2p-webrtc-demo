'use strict';

var ZeroClipboard = require("zeroclipboard");

function LocalNodePointerPanel() {
    return {
        restrict: 'E',
        templateUrl: "views/local-node-pointer-panel.html",
        scope: {
            content: "&content"
        },
        link: function(scope, elem, attrs) {

            ZeroClipboard.config({ swfPath: "//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf" });
            var client = new ZeroClipboard(elem.find('a'));

            client.on('ready', function(event) {

                client.on('copy', function(event) {
                    event.clipboardData.setData('text/plain', scope.content());
                });

                client.on('aftercopy', function(event) {
                    //console.log('Copied text to clipboard: ' + event.data['text/plain']);
                });
            });

            client.on('error', function(event) {
                console.error( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
                ZeroClipboard.destroy();
            });
        }
    }
}

module.exports = LocalNodePointerPanel;
