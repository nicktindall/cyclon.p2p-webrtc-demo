'use strict';

var VERSION_INTERVAL_MS = 60000;

/**
	Periodically check the server version and trigger a refresh if it's
	greater than the client version
*/
function VersionCheckService($rootScope, $interval, $http, $log, frontendVersionService) {

	$interval(function() {
		$http.get('/version')
			.then(function(response) {
				var serverVersion = response.data.FRONTEND_VERSION;

				if(typeof(serverVersion) === "number") {
					var localVersion = frontendVersionService.getVersion();
					if(serverVersion > localVersion) {
						$rootScope.$broadcast("newerVersionDetected", localVersion, serverVersion);
					}
				}
				else {
					$log.warn("Server returned invalid version: "+serverVersion);
				}
			});
	}, VERSION_INTERVAL_MS);
}

module.exports = VersionCheckService;
