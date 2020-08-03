import HotkeyIds from "../constants/hotkeys-ids";

/*global overwolf*/

async function getCurrentOverwolfLanguage() {
    return new Promise((resolve, reject) => {
        overwolf.settings.language.get(resp => {
            resolve(resp);
        });
    });
}

async function getHotkey(key) {
    return new Promise((resolve, reject) => {
        overwolf.settings.getHotKey(key, resp => {
            resolve(resp);
        });
    });
}

async function getAllHotkeys() {
    var keys = Object.keys(HotkeyIds);
    var hotkeys = [];

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var hotkeyResponse = await getHotkey(HotkeyIds[key]);

        hotkeys.push({
            key: HotkeyIds[key],
            hotkey: hotkeyResponse.hotkey
        });
    }

    return hotkeys;
}

async function getOverlayEnabled(gameClassId) {
    return new Promise((resolve, reject) => {
        overwolf.settings.games.getOverlayEnabled(gameClassId, resp => {
            resolve(resp);
        });
    });
}

async function getAutoLaunchEnabled(gameClassId) {
    return new Promise((resolve, reject) => {
        overwolf.settings.games.getAutoLaunchEnabled(gameClassId, resp => {
            resolve(resp);
        });
    });
}

async function getRegionInfo() {
    return new Promise((resolve, reject) => {
        overwolf.os.getRegionInfo(resp => {
            resolve(resp);
        });
    });
}

export default {
    getCurrentOverwolfLanguage,
    getHotkey,
    getAllHotkeys,
    getOverlayEnabled,
    getAutoLaunchEnabled,
    getRegionInfo
}