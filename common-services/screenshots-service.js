/*global overwolf*/

function takeScreenShot() {
	return new Promise((resolve, reject) => {
		overwolf.media.takeScreenshot(function(result) {
			if (result.status === 'success') {
				resolve(result.url);
			} else {
				reject(result);
			}
		});
	});
}

function getScreenshotUrl() {
	return new Promise((resolve, reject) => {
		overwolf.media.getScreenshotUrl({
			roundAwayFromZero: 'true',
			rescale: {
				width: -0.5,
				height: -0.5
			}
		}, function(result) {
			if (result.status === 'success') {
				resolve(result.url);
			} else {
				reject(result);
			}
		});
	});
}

export default {
	getScreenshotUrl,
	takeScreenShot
}