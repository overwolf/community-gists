/* global overwolf */

async function turnOnReplay(settings) {
    return new Promise((resolve, reject) => {
        overwolf.media.replays.turnOn(settings,
            (response) => {
                if (response.status == "success")
                    resolve(response);
                else
                    reject(response);
            });
    });
}

function capture(replayType, pastDuration, futureDuration, captureFinishedCallback, callback) {
    overwolf.media.replays.capture(replayType, pastDuration, futureDuration, captureFinishedCallback, callback);
}

async function turnOffReplay() {
    return new Promise((resolve, reject) => {
        overwolf.media.replays.turnOff((response) => resolve(response));
    });
}

export default {
    turnOnReplay,
    capture,
    turnOffReplay
}