/* global overwolf */

async function checkForExtensionUpdate() {
    return new Promise((resolve, reject) => {
        overwolf.extensions.checkForExtensionUpdate((result) => {
            resolve(result);
        });
    });
}

async function updateExtension() {
    return new Promise((resolve, reject) => {
        overwolf.extensions.updateExtension((result) => {
            resolve(result);
        });
    });
}

function relaunch() {
    overwolf.extensions.relaunch();
}

export default {
    checkForExtensionUpdate,
    updateExtension,
    relaunch
};