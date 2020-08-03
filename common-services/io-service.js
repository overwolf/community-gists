/* global overwolf */

async function fileExists(path) {
    return new Promise((resolve, reject) => {
        overwolf.io.fileExists(path, fileExists => {
            resolve(fileExists);
        });
    });
}

async function writeFileContents(filePath, content, encoding, triggerUacIfRequired) {
    return new Promise((resolve, reject) => {
        overwolf.io.writeFileContents(filePath, content, encoding, triggerUacIfRequired, result => {
            resolve(result);
        });
    });
}

async function copyFile(source, destination, overrideFile, reserved) {
    return new Promise((resolve, reject) => {
        overwolf.io.copyFile(source, destination, overrideFile, reserved, result => {
            resolve(result);
        });
    });
}


export default {
    fileExists,
    writeFileContents,
    copyFile
};