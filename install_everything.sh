#!/bin/bash

(cd ../cyclon-webrtc-client; npm install ../cyclon-lib)
(cd ../cyclon-webrtc-server; npm install ../cyclon-webrtc-client)
(cd ../cyclon-webrtc-server; npm install ../cyclon-lib)
npm install ../cyclon-lib
npm install ../cyclon-webrtc-client
npm install ../cyclon-webrtc-server
