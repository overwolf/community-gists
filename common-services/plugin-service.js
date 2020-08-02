/*global overwolf*/

async function getPlugin(pluginName) {
    return new Promise((resolve, reject) => {
        overwolf.extensions.current.getExtraObject(pluginName, (getPluginResult) => {
            if (getPluginResult.status === "success") {
                var _plugin = getPluginResult.object;
                resolve(_plugin);
            }
            else
                reject(getPluginResult);
        });
    });
}

export default {
    getPlugin
}